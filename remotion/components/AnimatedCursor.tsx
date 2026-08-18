import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Interactive } from 'remotion';

interface AnimatedCursorProps {
  name: string;
  role: string;
  avatarChar: string;
  color?: string;
  path: {
    frame: number;
    x: number;
    y: number;
    click?: boolean;
    label?: string;
  }[];
}

export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  name,
  role,
  avatarChar,
  color = '#0066FF',
  path,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (path.length === 0) return null;

  // Extract frames, xs, ys
  const frames = path.map((p) => p.frame);
  const xs = path.map((p) => p.x);
  const ys = path.map((p) => p.y);

  const currentX = interpolate(frame, frames, xs, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const currentY = interpolate(frame, frames, ys, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Check if there is an active click near current frame
  const recentClickPoint = path.find(
    (p) => p.click && frame >= p.frame && frame <= p.frame + 20
  );

  const clickSpring = recentClickPoint
    ? spring({
        frame: frame - recentClickPoint.frame,
        fps,
        config: { damping: 11, mass: 0.45, stiffness: 220 },
      })
    : 0;

  const currentLabel =
    [...path].reverse().find((p) => frame >= p.frame && p.label)?.label || role;

  const firstFrame = frames[0];
  const lastFrame = frames[frames.length - 1];

  const cursorOpacity = interpolate(
    frame,
    [firstFrame - 6, firstFrame, lastFrame, lastFrame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (cursorOpacity <= 0) return null;

  return (
    <Interactive.Div
      name={`Cursor - ${name}`}
      style={{
        position: 'absolute',
        left: currentX,
        top: currentY,
        opacity: cursorOpacity,
        zIndex: 60,
        pointerEvents: 'none',
        transform: `scale(${interpolate(clickSpring, [0, 0.4, 1], [1, 0.85, 1])})`,
      }}
    >
      {/* SVG Mouse Pointer */}
      <div style={{ position: 'relative' }}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="1.85"
          style={{
            filter: `drop-shadow(0 6px 12px ${color}66)`,
            transform: 'rotate(-5deg)',
          }}
        >
          <path d="M3 3l7 18 3-7 7-3L3 3z" />
        </svg>

        {/* Double Click Ping Expansion Waves */}
        {recentClickPoint && (
          <>
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: -10,
                width: 48,
                height: 48,
                borderRadius: 9999,
                border: `2.5px solid ${color}`,
                opacity: interpolate(clickSpring, [0, 1], [1, 0]),
                transform: `scale(${interpolate(clickSpring, [0, 1], [0.5, 2.2])})`,
                boxShadow: `0 0 15px ${color}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -6,
                left: -6,
                width: 40,
                height: 40,
                borderRadius: 9999,
                border: `1.5px solid #FFFFFF`,
                opacity: interpolate(clickSpring, [0, 1], [0.8, 0]),
                transform: `scale(${interpolate(clickSpring, [0, 1], [0.4, 1.6])})`,
              }}
            />
          </>
        )}
      </div>

      {/* User Info Capsule Tag */}
      <div
        style={{
          marginTop: 6,
          marginLeft: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 3,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '5px 12px',
            borderRadius: 9999,
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            boxShadow: `0 8px 24px rgba(0,0,0,0.18), 0 0 15px ${color}33`,
            fontFamily: 'Figtree, Inter, sans-serif',
            fontSize: 12.5,
            fontWeight: 800,
            color: '#0F172A',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: 9999,
              backgroundColor: color,
              color: '#FFFFFF',
              fontSize: 10.5,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 2px 6px ${color}66`,
            }}
          >
            {avatarChar}
          </span>
          <span>{name}</span>
        </div>

        {currentLabel && (
          <div
            style={{
              padding: '3px 10px',
              borderRadius: 8,
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontFamily: 'Figtree, Inter, sans-serif',
              fontSize: 10.5,
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {currentLabel}
          </div>
        )}
      </div>
    </Interactive.Div>
  );
};
