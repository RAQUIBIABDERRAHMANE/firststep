import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import captionsData from '../captions/ad-captions.json';

interface CaptionToken {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs?: number | null;
  confidence?: number | null;
}

interface CaptionsOverlayProps {
  highlightColor?: string;
  captions?: CaptionToken[];
}

export const CaptionsOverlay: React.FC<CaptionsOverlayProps> = ({
  highlightColor = '#0066FF',
  captions = captionsData as CaptionToken[],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;

  // Group tokens into sentences/pages based on pauses (> 500ms between tokens)
  const pages = useMemo(() => {
    const result: CaptionToken[][] = [];
    let currentPage: CaptionToken[] = [];

    for (let i = 0; i < captions.length; i++) {
      const token = captions[i];
      const prevToken = captions[i - 1];

      if (prevToken && token.startMs - prevToken.endMs > 600) {
        if (currentPage.length > 0) {
          result.push(currentPage);
          currentPage = [];
        }
      }
      currentPage.push(token);
    }
    if (currentPage.length > 0) {
      result.push(currentPage);
    }
    return result;
  }, [captions]);

  // Find currently active page
  const activePage = pages.find((page) => {
    const pageStart = page[0].startMs;
    const pageEnd = page[page.length - 1].endMs + 300;
    return currentTimeMs >= pageStart - 100 && currentTimeMs <= pageEnd;
  });

  if (!activePage) return null;

  const pageStartMs = activePage[0].startMs;
  const pageEndMs = activePage[activePage.length - 1].endMs;
  const pageStartFrame = (pageStartMs / 1000) * fps;
  const pageEndFrame = (pageEndMs / 1000) * fps;

  const pageOpacity = interpolate(
    frame,
    [pageStartFrame - 4, pageStartFrame, pageEndFrame, pageEndFrame + 6],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 60,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 72,
      }}
    >
      <div
        style={{
          opacity: pageOpacity,
          transform: `translateY(${interpolate(
            frame,
            [pageStartFrame - 4, pageStartFrame],
            [12, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          )}px)`,
          padding: '12px 28px',
          borderRadius: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '85%',
        }}
      >
        <div
          style={{
            fontFamily: 'Syne, Outfit, system-ui, sans-serif',
            fontSize: 28,
            fontWeight: 800,
            color: '#FFFFFF',
            whiteSpace: 'pre',
            letterSpacing: '-0.01em',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {activePage.map((token, idx) => {
            const isActive =
              token.startMs <= currentTimeMs && token.endMs >= currentTimeMs;
            const isPast = token.endMs < currentTimeMs;

            return (
              <span
                key={idx}
                style={{
                  color: isActive
                    ? '#38BDF8'
                    : isPast
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.45)',
                  fontWeight: isActive ? 900 : 700,
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  textShadow: isActive
                    ? `0 0 16px ${highlightColor}, 0 0 30px #38BDF8`
                    : 'none',
                  transition: 'all 0.1s ease',
                  display: 'inline-block',
                }}
              >
                {token.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
