import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { KineticText } from '../components/KineticText';
import { CameraRig } from '../components/CameraRig';
import { Underline } from '@remotion/rough-notation';

export const Scene6CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaEntrance = spring({
    frame: frame - 18,
    fps,
    config: { damping: 13, mass: 0.75, stiffness: 130 },
  });

  const statsEntrance = spring({
    frame: frame - 38,
    fps,
    config: { damping: 15, mass: 0.85, stiffness: 110 },
  });

  const buttonPulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.97, 1.03]);
  const spinAngle = (frame * 3.5) % 360;

  const stats = [
    { value: '500+', label: 'Entreprises Actives' },
    { value: '99.9%', label: 'Disponibilité Garantie' },
    { value: '5 min', label: 'Pour Démarrer' },
    { value: '24/7', label: 'Support Dédié Maroc' },
  ];

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig zoomRange={[0.96, 1.05]} tiltXRange={[6, 0]} duration={150}>
        <BackgroundGlow theme="cyber" />

        {/* Top Tag & Main Display Headline */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 90,
            zIndex: 30,
          }}
        >
          <div
            style={{
              padding: '6px 22px',
              borderRadius: 9999,
              backgroundColor: 'rgba(0, 102, 255, 0.22)',
              border: '1.5px solid rgba(56, 189, 248, 0.45)',
              color: '#38BDF8',
              fontFamily: 'Figtree, sans-serif',
              fontSize: 13.5,
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            🚀 Passez à la vitesse supérieure
          </div>

          <KineticText
            text="PRÊT À PROPULSER VOTRE ENTREPRISE ?"
            highlightWords={['PROPULSER', 'ENTREPRISE']}
            annotationType="circle"
            annotationColor="#38BDF8"
            highlightColor="#38BDF8"
            color="#FFFFFF"
            fontSize={74}
            subtitle="Rejoignez les centaines d'entrepreneurs qui font grandir leur activité avec FirstStep."
          />
        </AbsoluteFill>

        {/* Center Grand Glowing CTA Button */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 360,
            zIndex: 30,
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: 9999,
              padding: 3.5,
              overflow: 'hidden',
              opacity: interpolate(ctaEntrance, [0, 1], [0, 1]),
              transform: `scale(${interpolate(ctaEntrance, [0, 1], [0.8, 1]) * buttonPulse})`,
              boxShadow: '0 25px 70px rgba(0, 102, 255, 0.6), 0 0 50px rgba(56, 189, 248, 0.4)',
            }}
          >
            {/* Animated Conic Laser Border */}
            <div
              style={{
                position: 'absolute',
                inset: '-200%',
                background: `conic-gradient(from ${spinAngle}deg, #0066FF 0%, #10B981 33%, #38BDF8 66%, #0066FF 100%)`,
              }}
            />

            {/* Button Inner */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                borderRadius: 9999,
                backgroundColor: '#0066FF',
                padding: '24px 68px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <span
                style={{
                  fontFamily: 'Syne, Outfit, sans-serif',
                  fontSize: 26,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                }}
              >
                ESSAYER FIRSTSTEP GRATUITEMENT
              </span>
              <span
                style={{
                  fontSize: 30,
                  color: '#38BDF8',
                  fontWeight: 900,
                }}
              >
                ↗
              </span>
            </div>
          </div>

          {/* Website domain with Rough Notation Underline */}
          <div
            style={{
              marginTop: 22,
              fontFamily: 'Figtree, sans-serif',
              fontSize: 19,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.05em',
              opacity: interpolate(ctaEntrance, [0, 1], [0, 1]),
            }}
          >
            👉 Rendez-vous dès aujourd'hui sur{' '}
            <Underline
              color="#38BDF8"
              progress={interpolate(frame, [35, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
              strokeWidth={3}
            >
              <span style={{ color: '#38BDF8', fontWeight: 900 }}>firststep.ma</span>
            </Underline>
          </div>
        </AbsoluteFill>

        {/* Bottom Horizontal Stats Strip */}
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 155,
            zIndex: 25,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 270px)',
              gap: 22,
              opacity: interpolate(statsEntrance, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(statsEntrance, [0, 1], [30, 0])}px)`,
            }}
          >
            {stats.map((st, i) => (
              <div
                key={i}
                style={{
                  padding: '16px 20px',
                  borderRadius: 20,
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(16px)',
                  textAlign: 'center',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 26,
                    fontWeight: 900,
                    color: '#FFFFFF',
                  }}
                >
                  {st.value}
                </div>
                <div
                  style={{
                    fontFamily: 'Figtree, sans-serif',
                    fontSize: 12.5,
                    color: '#94A3B8',
                    marginTop: 2,
                    fontWeight: 600,
                  }}
                >
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};
