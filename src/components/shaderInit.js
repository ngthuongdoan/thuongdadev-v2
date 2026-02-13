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
    state.pageVisible = document.visibilityState !== 'hidden';
    state.active = state.pageVisible && (!pauseWhenOffscreen || state.inViewport);
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
        state.inViewport = entries.some((entry) => entry.isIntersecting);
        state.active = state.pageVisible && state.inViewport;
      },
      { root: null, threshold: 0.01 }
    );

    observer.observe(element);
    cleanups.push(() => observer.disconnect());
    return () => cleanups.forEach((fn) => fn());
  }

  // Fallback when IntersectionObserver is unavailable.
  const updateViewportState = () => {
    state.inViewport = isElementInViewport(element);
    state.active = state.pageVisible && state.inViewport;
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

async function mountShader(element, options, state) {
  // LCP protection: wait for full load + idle before importing/initializing WebGL.
  await waitForWindowLoad();
  await waitForIdle();

  if (state.disposed) {
    return () => {};
  }

  const {
    ShaderMount,
    PatternShapes,
    getShaderColorFromString,
    warpFragmentShader,
  } = await import('@paper-design/shaders');

  if (state.disposed) {
    return () => {};
  }

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
    u_shape: PatternShapes.Checks,
  };

  const shaderMount = new ShaderMount(
    element,
    warpFragmentShader,
    uniforms,
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

  const cleanupVisibility = setupVisibilityControls(element, state, options.pauseWhenOffscreen);
  const cleanupLoop = createFrameLoop(shaderMount, state, options.speed, options.fps);

  return () => {
    cleanupLoop();
    cleanupVisibility();
    shaderMount.dispose();
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
      return undefined;
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
        cleanup();
      }
    });

    return () => {
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
