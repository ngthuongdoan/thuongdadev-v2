import React, { useEffect, useRef } from 'react';

const DEFAULTS = {
  color1: '#09090b',
  color2: '#27272a',
  color3: '#52525b',
  speed: 0.6,
  scale: 1,
  rotation: 0,
  proportion: 0.35,
  softness: 1,
  distortion: 0.25,
  swirl: 0.8,
  swirlIterations: 10,
  shapeScale: 0.3,
  fps: 30,
  pauseWhenOffscreen: true,
};

const DEBUG_PREFIX = '[ShaderBackground]';

function debugLog(message, details) {
  if (typeof console === 'undefined') {
    return;
  }

  if (typeof details === 'undefined') {
    console.log(`${DEBUG_PREFIX} ${message}`);
    return;
  }

  console.log(`${DEBUG_PREFIX} ${message}`, details);
}

function debugWarn(message, details) {
  if (typeof console === 'undefined') {
    return;
  }

  if (typeof details === 'undefined') {
    console.warn(`${DEBUG_PREFIX} ${message}`);
    return;
  }

  console.warn(`${DEBUG_PREFIX} ${message}`, details);
}

function debugError(message, details) {
  if (typeof console === 'undefined') {
    return;
  }

  if (typeof details === 'undefined') {
    console.error(`${DEBUG_PREFIX} ${message}`);
    return;
  }

  console.error(`${DEBUG_PREFIX} ${message}`, details);
}

function waitForWindowLoad() {
  if (typeof window === 'undefined' || document.readyState === 'complete') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.addEventListener('load', resolve, { once: true });
  });
}

function waitForIdle(timeout = 1500) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // Lighthouse/TBT: idle scheduling keeps shader setup off the critical render path.
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => resolve(), { timeout });
      return;
    }

    // Fallback for browsers without requestIdleCallback.
    window.setTimeout(resolve, 1);
  });
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom > 0 && rect.right > 0 && rect.top < viewHeight && rect.left < viewWidth;
}

function setupVisibilityControls(element, state, pauseWhenOffscreen) {
  const cleanups = [];

  const updateFromPageVisibility = () => {
    const nextPageVisible = document.visibilityState !== 'hidden';
    const nextActive = nextPageVisible && (!pauseWhenOffscreen || state.inViewport);

    if (nextPageVisible !== state.pageVisible || nextActive !== state.active) {
      debugLog('page visibility updated', {
        pageVisible: nextPageVisible,
        inViewport: state.inViewport,
        active: nextActive,
      });
    }

    state.pageVisible = nextPageVisible;
    state.active = nextActive;
  };

  state.inViewport = true;
  updateFromPageVisibility();

  const onVisibilityChange = () => updateFromPageVisibility();
  document.addEventListener('visibilitychange', onVisibilityChange);
  cleanups.push(() => document.removeEventListener('visibilitychange', onVisibilityChange));

  if (!pauseWhenOffscreen) {
    return () => cleanups.forEach((fn) => fn());
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const nextInViewport = entries.some((entry) => entry.isIntersecting);
        const nextActive = state.pageVisible && nextInViewport;

        if (nextInViewport !== state.inViewport || nextActive !== state.active) {
          debugLog('viewport intersection updated', {
            inViewport: nextInViewport,
            pageVisible: state.pageVisible,
            active: nextActive,
          });
        }

        state.inViewport = nextInViewport;
        state.active = nextActive;
      },
      { root: null, threshold: 0.01 }
    );

    observer.observe(element);
    cleanups.push(() => observer.disconnect());
    return () => cleanups.forEach((fn) => fn());
  }

  // Fallback when IntersectionObserver is unavailable.
  const updateViewportState = () => {
    const nextInViewport = isElementInViewport(element);
    const nextActive = state.pageVisible && nextInViewport;

    if (nextInViewport !== state.inViewport || nextActive !== state.active) {
      debugLog('viewport fallback updated', {
        inViewport: nextInViewport,
        pageVisible: state.pageVisible,
        active: nextActive,
      });
    }

    state.inViewport = nextInViewport;
    state.active = nextActive;
  };

  const onScrollOrResize = () => updateViewportState();
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  updateViewportState();

  cleanups.push(() => window.removeEventListener('scroll', onScrollOrResize));
  cleanups.push(() => window.removeEventListener('resize', onScrollOrResize));

  return () => cleanups.forEach((fn) => fn());
}

function createFrameLoop(shaderMount, state, animationSpeed, fps) {
  const frameBudget = 1000 / Math.max(1, fps);
  let lastTick = 0;
  let rafId = 0;

  const loop = (now) => {
    if (state.disposed) {
      return;
    }

    rafId = window.requestAnimationFrame(loop);

    if (!state.active) {
      return;
    }

    // CPU reduction: throttle to ~30fps instead of rendering every 60hz frame.
    if (now - lastTick < frameBudget) {
      return;
    }

    const delta = lastTick === 0 ? frameBudget : now - lastTick;
    lastTick = now;
    state.frameMs += delta * animationSpeed;
    shaderMount.setFrame(state.frameMs);
  };

  rafId = window.requestAnimationFrame(loop);
  return () => window.cancelAnimationFrame(rafId);
}

function getDeclaredUniformNames(fragmentShaderSource) {
  if (typeof fragmentShaderSource !== 'string') {
    return new Set();
  }

  const uniformNamePattern = /\buniform\s+\w+\s+(\w+)\s*;/g;
  const names = new Set();
  let match = uniformNamePattern.exec(fragmentShaderSource);

  while (match) {
    names.add(match[1]);
    match = uniformNamePattern.exec(fragmentShaderSource);
  }

  return names;
}

function filterUniformsForShader(uniforms, fragmentShaderSource) {
  const declaredNames = getDeclaredUniformNames(fragmentShaderSource);
  if (declaredNames.size === 0) {
    return uniforms;
  }

  return Object.fromEntries(
    Object.entries(uniforms).filter(([uniformName]) => declaredNames.has(uniformName))
  );
}

async function mountShader(element, options, state) {
  debugLog('mount started', {
    width: element.clientWidth,
    height: element.clientHeight,
    options,
  });

  // LCP protection: wait for full load + idle before importing/initializing WebGL.
  await waitForWindowLoad();
  await waitForIdle();
  debugLog('window load + idle complete');

  if (state.disposed) {
    debugWarn('mount aborted because state is already disposed');
    return () => {};
  }

  const {
    ShaderMount,
    PatternShapes,
    getShaderColorFromString,
    warpFragmentShader,
  } = await import('@paper-design/shaders');
  debugLog('shader module imported');

  if (state.disposed) {
    debugWarn('mount aborted after import because state is disposed');
    return () => {};
  }

  const patternShapeChecks = PatternShapes?.Checks ?? 0;
  const uniforms = {
    u_scale: options.scale,
    u_rotation: options.rotation,
    u_color1: getShaderColorFromString(options.color1),
    u_color2: getShaderColorFromString(options.color2),
    u_color3: getShaderColorFromString(options.color3),
    u_proportion: options.proportion,
    u_softness: options.softness,
    u_distortion: options.distortion,
    u_swirl: options.swirl,
    u_swirlIterations: options.swirlIterations,
    u_shapeScale: options.shapeScale,
    u_shape: patternShapeChecks,
  };
  const safeUniforms = filterUniformsForShader(uniforms, warpFragmentShader);
  debugLog('uniforms prepared', {
    inputUniformCount: Object.keys(uniforms).length,
    filteredUniformCount: Object.keys(safeUniforms).length,
    filteredUniformNames: Object.keys(safeUniforms),
  });

  const shaderMount = new ShaderMount(
    element,
    warpFragmentShader,
    safeUniforms,
    {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    },
    0
  );
  debugLog('ShaderMount initialized successfully');

  const cleanupVisibility = setupVisibilityControls(element, state, options.pauseWhenOffscreen);
  const cleanupLoop = createFrameLoop(shaderMount, state, options.speed, options.fps);
  debugLog('animation loop + visibility controls attached');

  return () => {
    debugLog('teardown started');
    cleanupLoop();
    cleanupVisibility();
    shaderMount.dispose();
    debugLog('teardown finished');
  };
}

export default function ShaderBackgroundClient(props) {
  const hostRef = useRef(null);

  const options = {
    color1: props.color1 ?? DEFAULTS.color1,
    color2: props.color2 ?? DEFAULTS.color2,
    color3: props.color3 ?? DEFAULTS.color3,
    speed: props.speed ?? DEFAULTS.speed,
    scale: props.scale ?? DEFAULTS.scale,
    rotation: props.rotation ?? DEFAULTS.rotation,
    proportion: props.proportion ?? DEFAULTS.proportion,
    softness: props.softness ?? DEFAULTS.softness,
    distortion: props.distortion ?? DEFAULTS.distortion,
    swirl: props.swirl ?? DEFAULTS.swirl,
    swirlIterations: props.swirlIterations ?? DEFAULTS.swirlIterations,
    shapeScale: props.shapeScale ?? DEFAULTS.shapeScale,
    fps: props.fps ?? DEFAULTS.fps,
    pauseWhenOffscreen: props.pauseWhenOffscreen ?? DEFAULTS.pauseWhenOffscreen,
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof window === 'undefined') {
      debugWarn('effect skipped because host or window is unavailable');
      return undefined;
    }

    debugLog('effect started', {
      className: props.className ?? '',
      width: host.clientWidth,
      height: host.clientHeight,
    });
    if (host.clientWidth === 0 || host.clientHeight === 0) {
      debugWarn('host has zero size; shader may not be visible', {
        width: host.clientWidth,
        height: host.clientHeight,
      });
    }

    const state = {
      disposed: false,
      active: true,
      pageVisible: true,
      inViewport: true,
      frameMs: 0,
    };

    let cleanup = () => {};
    mountShader(host, options, state).then((teardown) => {
      cleanup = teardown;
      if (state.disposed) {
        debugWarn('state disposed before mount completed; running immediate teardown');
        cleanup();
      }
    }).catch((error) => {
      debugError('mount failed', error);
    });

    return () => {
      debugLog('effect cleanup triggered');
      state.disposed = true;
      cleanup();
    };
  }, [
    options.color1,
    options.color2,
    options.color3,
    options.speed,
    options.scale,
    options.rotation,
    options.proportion,
    options.softness,
    options.distortion,
    options.swirl,
    options.swirlIterations,
    options.shapeScale,
    options.fps,
    options.pauseWhenOffscreen,
  ]);

  return React.createElement('div', {
    ref: hostRef,
    className: props.className ?? '',
    style: {
      width: '100%',
      height: '100%',
      ...(props.style ?? {}),
    },
    'aria-hidden': 'true',
  });
}
