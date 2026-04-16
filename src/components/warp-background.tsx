import { useEffect, useState } from 'react';
import { Warp, type WarpProps as _W } from '@paper-design/shaders-react';

type WarpProps = Omit<_W, 'width' | 'height'> & {
  style?: React.CSSProperties;
  fps?: number;
  pauseWhenOffscreen?: boolean;
};

const DEFAULT_PROPS: Partial<WarpProps> = {
  speed: 0.4,
  rotation: 0.5,
};

const DEFAULT_STYLE = { width: '100%', height: '100%' };

export default function WarpBackground(props: WarpProps) {
  const [isDomReady, setIsDomReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (document.readyState !== 'loading') {
      window.requestAnimationFrame(() => setIsDomReady(true));
      return;
    }

    const onDomReady = () => {
      window.requestAnimationFrame(() => setIsDomReady(true));
    };

    window.addEventListener('DOMContentLoaded', onDomReady, { once: true });
    return () => window.removeEventListener('DOMContentLoaded', onDomReady);
  }, [isDomReady]);

  if (!isDomReady) return null;

  return (
    <Warp
      {...DEFAULT_PROPS}
      {...props}
      style={{ ...DEFAULT_STYLE, ...(props.style ?? {}) }}
    />
  );
}
