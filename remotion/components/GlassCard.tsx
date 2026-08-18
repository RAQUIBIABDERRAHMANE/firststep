import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Interactive } from 'remotion';

interface GlassCardProps {
  name?: string;
  children: React.ReactNode;
  delay?: number;
  width?: number | string;
  height?: number | string;
  tiltX?: number;
  tiltY?: number;
  rotateZ?: number;
  scale?: number;
  padding?: number | string;
  borderRadius?: number;
  highlightBorder?: boolean;
  theme?: 'light' | 'dark';
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  name = 'Glass Card',
  children,
  delay = 0,
  width = 'auto',
  height = 'auto',
  tiltX = 0,
  tiltY = 0,
  rotateZ = 0,
  scale = 1,
  padding = 32,
  borderRadius = 28,
  highlightBorder = false,
  theme = 'light',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 14,
      mass: 0.85,
      stiffness: 120,
    },
  });

  const cardOpacity = interpolate(entrance, [0, 0.3, 1], [0, 0.9, 1]);
  const cardTranslateY = interpolate(entrance, [0, 1], [70, 0]);
  const cardScale = interpolate(entrance, [0, 1], [0.9, scale]);

  const isDark = theme === 'dark';

  return (
    <Interactive.Div
      name={name}
      style={{
        width,
        height,
        padding,
        borderRadius,
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(24px)',
        border: highlightBorder
          ? isDark
            ? '2px solid rgba(56, 189, 248, 0.45)'
            : '2px solid rgba(0, 102, 255, 0.45)'
          : isDark
          ? '1px solid rgba(255, 255, 255, 0.12)'
          : '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: highlightBorder
          ? isDark
            ? '0 25px 60px -15px rgba(0, 102, 255, 0.4), 0 0 35px rgba(56, 189, 248, 0.2)'
            : '0 25px 60px -15px rgba(0, 102, 255, 0.25), 0 10px 30px -10px rgba(15, 23, 42, 0.08)'
          : isDark
          ? '0 20px 50px -12px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 102, 255, 0.1)'
          : '0 20px 50px -12px rgba(15, 23, 42, 0.1), 0 8px 24px -8px rgba(15, 23, 42, 0.06)',
        opacity: cardOpacity,
        transform: `perspective(1200px) translateY(${cardTranslateY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotateZ}deg) scale(${cardScale})`,
        transformStyle: 'preserve-3d',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Top Subtle Shimmer Bar */}
      {highlightBorder && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #0066FF 0%, #38BDF8 50%, #10B981 100%)',
          }}
        />
      )}
      {children}
    </Interactive.Div>
  );
};
