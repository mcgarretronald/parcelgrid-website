import type { FC } from 'react';

type PlasmaProps = {
  color?: string;
  speed?: number;
  direction?: 'forward' | 'reverse' | 'pingpong';
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  renderScale?: number;
  maxDpr?: number;
  targetFps?: number;
  iterations?: number;
  lightMode?: boolean;
  className?: string;
};

declare const Plasma: FC<PlasmaProps>;
export default Plasma;
export { Plasma };
