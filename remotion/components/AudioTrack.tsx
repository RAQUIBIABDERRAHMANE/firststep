import React from 'react';
import { Audio } from '@remotion/media';
import { Sequence, staticFile } from 'remotion';

interface AudioTrackProps {
  enableMusic?: boolean;
  enableSfx?: boolean;
  musicSrc?: string;
}

export const AudioTrack: React.FC<AudioTrackProps> = ({
  enableMusic = true,
  enableSfx = true,
  musicSrc,
}) => {
  return (
    <>
      {/* Background Audio / Music Track */}
      {enableMusic && musicSrc && (
        <Audio
          src={musicSrc.startsWith('http') ? musicSrc : staticFile(musicSrc)}
          volume={(f) => {
            if (f < 30) return (f / 30) * 0.55;
            if (f > 900) return Math.max(0, (1 - (f - 900) / 45) * 0.55);
            return 0.55;
          }}
          loop
        />
      )}

      {/* SFX: High-Impact Synced Sound Effects */}
      {enableSfx && (
        <>
          {/* Scene 1 Chaos Entry Whip (frame 10) */}
          <Sequence from={10} durationInFrames={25}>
            <Audio src="https://remotion.media/whip.wav" volume={0.5} />
          </Sequence>

          {/* Scene 1 -> 2 Whoosh & Shutter (frame 140) */}
          <Sequence from={140} durationInFrames={30}>
            <Audio src="https://remotion.media/whoosh.wav" volume={0.7} />
          </Sequence>
          <Sequence from={145} durationInFrames={20}>
            <Audio src="https://remotion.media/shutter-modern.wav" volume={0.5} />
          </Sequence>

          {/* Scene 2 Holographic Card Pop (frame 185) */}
          <Sequence from={185} durationInFrames={20}>
            <Audio src="https://remotion.media/switch.wav" volume={0.5} />
          </Sequence>

          {/* Scene 2 -> 3 Transition Whoosh (frame 285) */}
          <Sequence from={285} durationInFrames={30}>
            <Audio src="https://remotion.media/whoosh.wav" volume={0.7} />
          </Sequence>

          {/* Scene 3 Clicks & Popups */}
          <Sequence from={345} durationInFrames={20}>
            <Audio src="https://remotion.media/mouse-click.wav" volume={0.7} />
          </Sequence>

          <Sequence from={420} durationInFrames={20}>
            <Audio src="https://remotion.media/mouse-click.wav" volume={0.7} />
          </Sequence>

          {/* Scene 3 -> 4 Transition (frame 495) */}
          <Sequence from={495} durationInFrames={30}>
            <Audio src="https://remotion.media/whoosh.wav" volume={0.7} />
          </Sequence>

          {/* Scene 4 Module Snap & Switch (frame 560 & 620) */}
          <Sequence from={560} durationInFrames={25}>
            <Audio src="https://remotion.media/switch.wav" volume={0.65} />
          </Sequence>
          <Sequence from={620} durationInFrames={25}>
            <Audio src="https://remotion.media/switch.wav" volume={0.65} />
          </Sequence>

          {/* Scene 4 -> 5 Transition (frame 705) */}
          <Sequence from={705} durationInFrames={30}>
            <Audio src="https://remotion.media/whoosh.wav" volume={0.7} />
          </Sequence>

          {/* Scene 5 AI Processing Whip (frame 730) */}
          <Sequence from={730} durationInFrames={25}>
            <Audio src="https://remotion.media/whip.wav" volume={0.55} />
          </Sequence>

          {/* Scene 5 AI Success Ding & Shutter (frame 800) */}
          <Sequence from={800} durationInFrames={40}>
            <Audio src="https://remotion.media/ding.wav" volume={0.8} />
          </Sequence>
          <Sequence from={805} durationInFrames={20}>
            <Audio src="https://remotion.media/shutter-modern.wav" volume={0.6} />
          </Sequence>

          {/* Scene 5 -> 6 Outro Whoosh (frame 855) */}
          <Sequence from={855} durationInFrames={30}>
            <Audio src="https://remotion.media/whoosh.wav" volume={0.75} />
          </Sequence>

          {/* Scene 6 CTA Impact Bell (frame 880) */}
          <Sequence from={880} durationInFrames={40}>
            <Audio src="https://remotion.media/ding.wav" volume={0.65} />
          </Sequence>
        </>
      )}
    </>
  );
};
