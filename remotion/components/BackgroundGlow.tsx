import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface BackgroundGlowProps {
  theme?: 'dark' | 'light' | 'chaos' | 'cyber';
}

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({ theme = 'light' }) => {
  const frame = useCurrentFrame();

  const isDark = theme === 'dark' || theme === 'cyber';
  const isChaos = theme === 'chaos';
  const isCyber = theme === 'cyber';

  const orb1X = interpolate(Math.sin(frame / 32), [-1, 1], [-90, 90]);
  const orb1Y = interpolate(Math.cos(frame / 36), [-1, 1], [-60, 60]);
  const orb2X = interpolate(Math.sin(frame / 24 + 1), [-1, 1], [70, -70]);
  const orb2Y = interpolate(Math.cos(frame / 28 + 1), [-1, 1], [50, -50]);

  // Scanline beam position
  const scanY = interpolate(frame % 90, [0, 90], [-100, 1180]);

  const bgStyle: React.CSSProperties = isCyber
    ? { backgroundColor: '#050811' }
    : isDark
    ? { backgroundColor: '#070B14' }
    : isChaos
    ? { backgroundColor: '#0A0B10' }
    : { backgroundColor: '#F8FAFC' };

  const gridColor = isDark || isChaos
    ? 'rgba(255, 255, 255, 0.045)'
    : 'rgba(0, 102, 255, 0.055)';

  return (
    <AbsoluteFill style={{ ...bgStyle, overflow: 'hidden' }}>
      {/* High-Tech Perspective Matrix Grid */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          backgroundImage: `linear-gradient(to right, ${gridColor} 1.5px, transparent 1.5px), linear-gradient(to bottom, ${gridColor} 1.5px, transparent 1.5px)`,
          backgroundSize: '54px 54px',
          opacity: 0.9,
          transform: 'perspective(600px) rotateX(15deg) scale(1.1)',
          transformOrigin: 'center 40%',
        }}
      />

      {/* Floating Glowing Radial Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          right: '12%',
          width: 800,
          height: 800,
          borderRadius: 9999,
          background: isChaos
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.28) 0%, rgba(249, 115, 22, 0.16) 40%, transparent 70%)'
            : isCyber
            ? 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)'
            : isDark
            ? 'radial-gradient(circle, rgba(0, 102, 255, 0.35) 0%, rgba(14, 165, 233, 0.18) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0, 102, 255, 0.18) 0%, rgba(14, 165, 233, 0.09) 50%, transparent 70%)',
          filter: 'blur(80px)',
          transform: `translate(${orb1X}px, ${orb1Y}px)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '2%',
          left: '8%',
          width: 700,
          height: 700,
          borderRadius: 9999,
          background: isChaos
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, transparent 70%)'
            : isCyber
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%)'
            : isDark
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(0, 102, 255, 0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(0, 102, 255, 0.08) 50%, transparent 70%)',
          filter: 'blur(70px)',
          transform: `translate(${orb2X}px, ${orb2Y}px)`,
          pointerEvents: 'none',
        }}
      />

      {/* Cyber Scanning Laser Line */}
      {isDark && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: scanY,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.6) 50%, transparent 100%)',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.8)',
            pointerEvents: 'none',
            opacity: 0.4,
          }}
        />
      )}

      {/* Floating Sparkle Particles */}
      {[...Array(6)].map((_, i) => {
        const pX = (i * 310 + 120 + frame * 0.4) % 1920;
        const pY = (i * 180 + 90 + Math.sin(frame / 20 + i) * 30) % 1080;
        const pScale = interpolate(Math.sin(frame / 15 + i), [-1, 1], [0.5, 1.3]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pX,
              top: pY,
              width: 5,
              height: 5,
              borderRadius: 9999,
              backgroundColor: isChaos ? '#F87171' : '#38BDF8',
              boxShadow: isChaos ? '0 0 8px #EF4444' : '0 0 8px #38BDF8',
              transform: `scale(${pScale})`,
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Modern Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark || isChaos
            ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)'
            : 'radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.05) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
