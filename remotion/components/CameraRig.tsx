import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface CameraRigProps {
  children: React.ReactNode;
  zoomRange?: [number, number];
  tiltXRange?: [number, number];
  tiltYRange?: [number, number];
  panXRange?: [number, number];
  panYRange?: [number, number];
  duration?: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  zoomRange = [1, 1.05],
  tiltXRange = [0, 0],
  tiltYRange = [0, 0],
  panXRange = [0, 0],
  panYRange = [0, 0],
  duration = 150,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, duration], zoomRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tiltX = interpolate(frame, [0, duration], tiltXRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tiltY = interpolate(frame, [0, duration], tiltYRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const panX = interpolate(frame, [0, duration], panXRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const panY = interpolate(frame, [0, duration], panYRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        perspective: 1200,
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate(${panX}px, ${panY}px)`,
          transformOrigin: 'center center',
          transition: 'transform 0.05s linear',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
