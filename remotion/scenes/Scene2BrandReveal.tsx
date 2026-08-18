import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Interactive } from 'remotion';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { KineticText } from '../components/KineticText';
import { GlassCard } from '../components/GlassCard';
import { CameraRig } from '../components/CameraRig';

export const Scene2BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo spring expansion
  const logoEntrance = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 130 },
  });

  const mockupEntrance = spring({
    frame: frame - 22,
    fps,
    config: { damping: 15, mass: 0.95, stiffness: 100 },
  });

  const spinAngle = (frame * 3) % 360;

  // Typing URL effect
  const fullUrl = 'firststep.ma/dashboard';
  const typedLength = Math.min(fullUrl.length, Math.floor(interpolate(frame, [15, 50], [0, fullUrl.length], { extrapolateRight: 'clamp' })));
  const currentUrl = fullUrl.slice(0, typedLength);

  const features = [
    { label: '📊 Finance & Facturation', delay: 40, x: -440, y: -20, color: '#0066FF' },
    { label: '🍽️ Modules Métier (Resto, Retail, etc.)', delay: 48, x: 440, y: -20, color: '#10B981' },
    { label: '⚡ IA & Automations Temps Réel', delay: 56, x: -440, y: 170, color: '#38BDF8' },
    { label: '👥 Multi-Utilisateurs & Rôles', delay: 64, x: 440, y: 170, color: '#8B5CF6' },
  ];

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig zoomRange={[0.96, 1.04]} tiltXRange={[8, 0]} tiltYRange={[-4, 2]} duration={150}>
        <BackgroundGlow theme="cyber" />

        {/* Top Brand Tag & Headline */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 70,
            zIndex: 30,
          }}
        >
          {/* Spinning Conic Gradient Pill */}
          <Interactive.Div
            name="Brand OS Tag"
            style={{
              position: 'relative',
              borderRadius: 9999,
              padding: 2.5,
              overflow: 'hidden',
              marginBottom: 18,
              opacity: interpolate(logoEntrance, [0, 1], [0, 1]),
              transform: `scale(${interpolate(logoEntrance, [0, 1], [0.8, 1])})`,
              boxShadow: '0 12px 35px rgba(0, 102, 255, 0.45)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-150%',
                background: `conic-gradient(from ${spinAngle}deg, #0066FF 0%, #10B981 33%, #38BDF8 66%, #0066FF 100%)`,
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                borderRadius: 9999,
                backgroundColor: '#070B14',
                padding: '8px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  backgroundColor: '#38BDF8',
                  boxShadow: '0 0 12px #38BDF8',
                }}
              />
              <span
                style={{
                  fontFamily: 'Syne, Outfit, sans-serif',
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: '0.22em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}
              >
                FIRSTSTEP · BUSINESS OPERATING SYSTEM
              </span>
            </div>
          </Interactive.Div>

          <KineticText
            text="TOUT VOTRE BUSINESS RÉUNI EN UN SEUL ENDROIT"
            highlightWords={['UN SEUL']}
            annotationType="circle"
            annotationColor="#38BDF8"
            highlightColor="#38BDF8"
            color="#FFFFFF"
            fontSize={68}
            subtitle="La plateforme tout-en-un pour diriger, facturer, automatiser et croître sans limites."
          />
        </AbsoluteFill>

        {/* 3D Browser Window Showcase */}
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 360,
            zIndex: 20,
          }}
        >
          <GlassCard
            name="Browser App Window"
            delay={20}
            width={1000}
            height={420}
            tiltX={10}
            tiltY={0}
            highlightBorder
            theme="dark"
            style={{
              backgroundColor: 'rgba(11, 15, 25, 0.94)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              boxShadow: '0 35px 90px rgba(0, 102, 255, 0.35), 0 0 50px rgba(56, 189, 248, 0.2)',
            }}
          >
            {/* Window Browser Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 16,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', gap: 7 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 9999, backgroundColor: '#EF4444' }} />
                  <div style={{ width: 12, height: 12, borderRadius: 9999, backgroundColor: '#F59E0B' }} />
                  <div style={{ width: 12, height: 12, borderRadius: 9999, backgroundColor: '#10B981' }} />
                </div>

                {/* Simulated URL Bar */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    padding: '4px 16px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: 'monospace',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    minWidth: 260,
                  }}
                >
                  <span style={{ color: '#10B981' }}>🔒</span>
                  <span style={{ color: '#FFFFFF' }}>https://{currentUrl}</span>
                  <span style={{ animation: 'blink 1s infinite', color: '#38BDF8' }}>|</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 9999,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#34D399',
                  fontSize: 11.5,
                  fontWeight: 700,
                  fontFamily: 'Figtree, sans-serif',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 9999,
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 8px #10B981',
                  }}
                />
                Business OS 100% Opérationnel
              </div>
            </div>

            {/* Central 3-Column Holographic Data Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
              
              <div
                style={{
                  padding: 20,
                  borderRadius: 18,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transform: 'perspective(600px) translateZ(15px)',
                }}
              >
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Figtree', fontWeight: 600 }}>
                  Chiffre d'Affaires Mensuel
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', fontFamily: 'Syne', marginTop: 6 }}>
                  142 850 MAD
                </div>
                <div style={{ fontSize: 12, color: '#34D399', fontWeight: 700, marginTop: 6 }}>
                  ↗ +24.6% ce mois
                </div>
              </div>

              <div
                style={{
                  padding: 20,
                  borderRadius: 18,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transform: 'perspective(600px) translateZ(25px)',
                }}
              >
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Figtree', fontWeight: 600 }}>
                  Factures & Recouvrement
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#38BDF8', fontFamily: 'Syne', marginTop: 6 }}>
                  98.2%
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
                  0 impayé critique
                </div>
              </div>

              <div
                style={{
                  padding: 20,
                  borderRadius: 18,
                  backgroundColor: 'rgba(0, 102, 255, 0.16)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  boxShadow: '0 0 25px rgba(0, 102, 255, 0.25)',
                  transform: 'perspective(600px) translateZ(35px)',
                }}
              >
                <div style={{ fontSize: 12, color: '#38BDF8', fontFamily: 'Figtree', fontWeight: 800 }}>
                  Copilote IA Actif
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', fontFamily: 'Syne', marginTop: 6 }}>
                  14 Automatisations
                </div>
                <div style={{ fontSize: 12, color: '#93C5FD', fontWeight: 600, marginTop: 6 }}>
                  Gain estimé: ~14h / sem
                </div>
              </div>

            </div>
          </GlassCard>
        </AbsoluteFill>

        {/* Floating Satellites Features with 3D Pop */}
        {features.map((feat, idx) => {
          const featSpring = spring({
            frame: frame - feat.delay,
            fps,
            config: { damping: 13, mass: 0.75, stiffness: 140 },
          });

          const featOpacity = interpolate(featSpring, [0, 1], [0, 1]);
          const featScale = interpolate(featSpring, [0, 1], [0.7, 1]);
          const featTranslateX = interpolate(featSpring, [0, 1], [feat.x > 0 ? feat.x + 90 : feat.x - 90, feat.x]);

          return (
            <AbsoluteFill
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 360,
                pointerEvents: 'none',
                zIndex: 35,
              }}
            >
              <div
                style={{
                  transform: `translate(${featTranslateX}px, ${feat.y}px) scale(${featScale})`,
                  opacity: featOpacity,
                  padding: '14px 24px',
                  borderRadius: 9999,
                  backgroundColor: 'rgba(15, 23, 42, 0.96)',
                  border: `1.5px solid ${feat.color}`,
                  boxShadow: `0 18px 40px rgba(0,0,0,0.5), 0 0 20px ${feat.color}44`,
                  color: '#FFFFFF',
                  fontFamily: 'Syne, Outfit, sans-serif',
                  fontSize: 16,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}
              >
                {feat.label}
              </div>
            </AbsoluteFill>
          );
        })}
      </CameraRig>
    </AbsoluteFill>
  );
};
