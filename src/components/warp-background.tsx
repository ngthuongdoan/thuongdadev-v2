import { useEffect, useState } from 'react';
import { Warp, type WarpProps } from '@paper-design/shaders-react';

const DEFAULT_PROPS: Partial<WarpProps> = {
  speed: 0.4,
  rotation: 0.5,
};

const DEFAULT_STYLE = { width: '100%', height: '100%' };

export default function WarpBackground(props: WarpProps) {
  const [isDomReady, setIsDomReady] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.readyState !== 'loading';
  });

  useEffect(() => {
    if (isDomReady || typeof window === 'undefined') return;

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
