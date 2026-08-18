import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';

import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2BrandReveal } from './scenes/Scene2BrandReveal';
import { Scene3Analytics } from './scenes/Scene3Analytics';
import { Scene4Modules } from './scenes/Scene4Modules';
import { Scene5AI } from './scenes/Scene5AI';
import { Scene6CTA } from './scenes/Scene6CTA';

import { CaptionsOverlay } from './components/CaptionsOverlay';
import { AudioTrack } from './components/AudioTrack';

export const FirstStepAdVideoSchema = z.object({
  enableMusic: z.boolean().optional().default(true),
  enableSfx: z.boolean().optional().default(true),
  showCaptions: z.boolean().optional().default(true),
  primaryColor: zColor().optional().default('#0066FF'),
  accentColor: zColor().optional().default('#38BDF8'),
  brandName: z.string().optional().default('FirstStep'),
});

export type FirstStepAdVideoProps = z.infer<typeof FirstStepAdVideoSchema>;

export const FirstStepAdVideo: React.FC<FirstStepAdVideoProps> = ({
  enableMusic = true,
  enableSfx = true,
  showCaptions = true,
  primaryColor = '#0066FF',
  accentColor = '#38BDF8',
  brandName = 'FirstStep',
}) => {
  const transitionDuration = 15;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070B14' }}>
      {/* Main Multi-Scene Timeline with Transitions */}
      <TransitionSeries>
        {/* Scene 1: Chaos / Hook (150 frames) */}
        <TransitionSeries.Sequence durationInFrames={150} name="Scene 1: Hook & Chaos">
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 2: Brand Reveal (150 frames) */}
        <TransitionSeries.Sequence durationInFrames={150} name="Scene 2: Business OS Reveal">
          <Scene2BrandReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 3: Live Analytics & Multi-User (210 frames) */}
        <TransitionSeries.Sequence durationInFrames={210} name="Scene 3: Live Finance Dashboard">
          <Scene3Analytics />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 4: Modular Industry Suites (210 frames) */}
        <TransitionSeries.Sequence durationInFrames={210} name="Scene 4: Industry Suites">
          <Scene4Modules />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 5: AI Engine (150 frames) */}
        <TransitionSeries.Sequence durationInFrames={150} name="Scene 5: Autonomous AI Hub">
          <Scene5AI />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 6: Finale CTA (150 frames) */}
        <TransitionSeries.Sequence durationInFrames={150} name="Scene 6: Grand Finale CTA">
          <Scene6CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Global TikTok/SaaS Dynamic Word-Highlighted Captions */}
      {showCaptions && <CaptionsOverlay highlightColor={accentColor} />}

      {/* Cinematic Audio Track & Synced SFX */}
      <AudioTrack enableMusic={enableMusic} enableSfx={enableSfx} />
    </AbsoluteFill>
  );
};
