import React from 'react';
import { Composition, Folder } from 'remotion';
import { FirstStepAdVideo, FirstStepAdVideoSchema } from './FirstStepAdVideo';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2BrandReveal } from './scenes/Scene2BrandReveal';
import { Scene3Analytics } from './scenes/Scene3Analytics';
import { Scene4Modules } from './scenes/Scene4Modules';
import { Scene5AI } from './scenes/Scene5AI';
import { Scene6CTA } from './scenes/Scene6CTA';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master 31.5s SaaS Product Launch Ad Video */}
      <Composition
        id="FirstStepAdVideo"
        component={FirstStepAdVideo}
        durationInFrames={945}
        fps={30}
        width={1920}
        height={1080}
        schema={FirstStepAdVideoSchema}
        defaultProps={{
          enableMusic: true,
          enableSfx: true,
          showCaptions: true,
          primaryColor: '#0066FF',
          accentColor: '#38BDF8',
          brandName: 'FirstStep',
        }}
      />

      {/* Sub-scenes folder for single-scene fine tuning in Remotion Studio */}
      <Folder name="Scenes">
        <Composition
          id="Scene1-Hook"
          component={Scene1Hook}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene2-BrandReveal"
          component={Scene2BrandReveal}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene3-Analytics"
          component={Scene3Analytics}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene4-Modules"
          component={Scene4Modules}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene5-AIEngine"
          component={Scene5AI}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Scene6-CTA"
          component={Scene6CTA}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
