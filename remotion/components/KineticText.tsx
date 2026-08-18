import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Interactive } from 'remotion';
import { Circle, Highlight, Underline, Box } from '@remotion/rough-notation';

export interface KineticTextProps {
  text: string;
  highlightWords?: string[];
  annotationType?: 'highlight' | 'circle' | 'underline' | 'box' | 'none';
  annotationColor?: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  highlightColor?: string;
  subtitle?: string;
  subtitleDelay?: number;
  align?: 'center' | 'left' | 'right';
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  highlightWords = [],
  annotationType = 'circle',
  annotationColor = '#0066FF',
  delay = 0,
  fontSize = 76,
  color = '#0F172A',
  highlightColor = '#0066FF',
  subtitle,
  subtitleDelay = 15,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(' ');

  const titleSpring = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 14,
      mass: 0.8,
      stiffness: 130,
    },
  });

  const subtitleSpring = subtitle
    ? spring({
        frame: frame - (delay + subtitleDelay),
        fps,
        config: {
          damping: 16,
          mass: 0.9,
          stiffness: 100,
        },
      })
    : 0;

  // Annotation progress driven deterministically by frame
  const annotationProgress = interpolate(
    frame,
    [delay + 18, delay + 38],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <Interactive.Div
      name="Kinetic Headline Container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        textAlign: align,
        width: '100%',
        maxWidth: 1440,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
          gap: '16px 22px',
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          fontWeight: 900,
          fontFamily: 'Syne, Outfit, system-ui, -apple-system, sans-serif',
        }}
      >
        {words.map((word, i) => {
          const isHighlighted = highlightWords.some(
            (hw) => word.toLowerCase().includes(hw.toLowerCase())
          );

          const wordSpring = spring({
            frame: frame - (delay + i * 2.5),
            fps,
            config: {
              damping: 12,
              mass: 0.65,
              stiffness: 150,
            },
          });

          const wordOpacity = interpolate(wordSpring, [0, 0.4, 1], [0, 0.8, 1]);
          const wordY = interpolate(wordSpring, [0, 1], [50, 0]);
          const wordScale = interpolate(wordSpring, [0, 1], [0.8, 1]);
          const wordRotateX = interpolate(wordSpring, [0, 1], [30, 0]);

          const wordContent = (
            <span
              style={{
                display: 'inline-block',
                fontSize,
                opacity: wordOpacity,
                transform: `perspective(800px) translateY(${wordY}px) rotateX(${wordRotateX}deg) scale(${wordScale})`,
                color: isHighlighted ? highlightColor : color,
                textShadow: isHighlighted
                  ? `0 0 35px ${highlightColor}77, 0 0 15px ${highlightColor}44`
                  : 'none',
              }}
            >
              {word}
            </span>
          );

          if (isHighlighted && annotationType !== 'none') {
            if (annotationType === 'circle') {
              return (
                <Circle
                  key={i}
                  color={annotationColor}
                  progress={annotationProgress}
                  strokeWidth={3.5}
                  padding={{ top: 8, right: 12, bottom: 8, left: 12 }}
                >
                  {wordContent}
                </Circle>
              );
            } else if (annotationType === 'highlight') {
              return (
                <Highlight
                  key={i}
                  color={`${annotationColor}33`}
                  progress={annotationProgress}
                  padding={{ top: 4, right: 8, bottom: 4, left: 8 }}
                >
                  {wordContent}
                </Highlight>
              );
            } else if (annotationType === 'underline') {
              return (
                <Underline
                  key={i}
                  color={annotationColor}
                  progress={annotationProgress}
                  strokeWidth={4}
                >
                  {wordContent}
                </Underline>
              );
            } else if (annotationType === 'box') {
              return (
                <Box
                  key={i}
                  color={annotationColor}
                  progress={annotationProgress}
                  strokeWidth={3}
                  padding={{ top: 6, right: 10, bottom: 6, left: 10 }}
                >
                  {wordContent}
                </Box>
              );
            }
          }

          return <span key={i}>{wordContent}</span>;
        })}
      </div>

      {subtitle && (
        <Interactive.Div
          name="Headline Subtitle"
          style={{
            marginTop: 22,
            fontSize: Math.round(fontSize * 0.36),
            fontWeight: 600,
            fontFamily: 'Figtree, Inter, system-ui, sans-serif',
            color: color === '#FFFFFF' ? 'rgba(255,255,255,0.78)' : '#475569',
            opacity: interpolate(subtitleSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(subtitleSpring, [0, 1], [25, 0])}px)`,
            maxWidth: 960,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </Interactive.Div>
      )}
    </Interactive.Div>
  );
};
