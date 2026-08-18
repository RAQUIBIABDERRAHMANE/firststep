import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { KineticText } from '../components/KineticText';
import { CameraRig } from '../components/CameraRig';

export const Scene5AI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sequential workflow steps timing
  const step1Spring = spring({ frame: frame - 12, fps, config: { damping: 13, mass: 0.75, stiffness: 140 } });
  const step2Spring = spring({ frame: frame - 42, fps, config: { damping: 13, mass: 0.75, stiffness: 140 } });
  const step3Spring = spring({ frame: frame - 72, fps, config: { damping: 13, mass: 0.75, stiffness: 140 } });

  // AI Core Pulse & Rotation
  const pulseScale = interpolate(Math.sin(frame / 5), [-1, 1], [0.94, 1.06]);
  const coreRotation = (frame * 3.5) % 360;

  // Final celebration glow
  const celebrationSpring = spring({ frame: frame - 90, fps, config: { damping: 12, mass: 0.6, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig zoomRange={[0.96, 1.05]} tiltXRange={[6, -2]} tiltYRange={[3, -3]} duration={150}>
        <BackgroundGlow theme="cyber" />

        {/* Top Headline */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 65,
            zIndex: 30,
          }}
        >
          <div
            style={{
              padding: '6px 20px',
              borderRadius: 9999,
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38BDF8',
              fontFamily: 'Figtree, sans-serif',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            🤖 Moteur d'Automatisation & Copilote IA
          </div>

          <KineticText
            text="AUTOMATISEZ VOS PROCESSUS GRÂCE À L'IA INTÉGRÉE"
            highlightWords={["L'IA", 'INTÉGRÉE']}
            annotationType="box"
            annotationColor="#38BDF8"
            highlightColor="#38BDF8"
            color="#FFFFFF"
            fontSize={62}
            subtitle="Zéro ressaisie manuelle. Rapprochement bancaire, facturation et alertes clients en 1 seconde."
          />
        </AbsoluteFill>

        {/* Center 3D AI Hub & Pipeline */}
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 290,
            zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 54 }}>
            
            {/* Left: Holographic AI Core Orb */}
            <div
              style={{
                position: 'relative',
                width: 340,
                height: 340,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Outer Conic Energy Ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 9999,
                  padding: 4.5,
                  background: `conic-gradient(from ${coreRotation}deg, #0066FF, #38BDF8, #10B981, #0066FF)`,
                  transform: `scale(${pulseScale})`,
                  boxShadow: '0 0 60px rgba(56, 189, 248, 0.5), 0 0 100px rgba(0, 102, 255, 0.3)',
                }}
              >
                <div style={{ width: '100%', height: '100%', borderRadius: 9999, backgroundColor: '#050811' }} />
              </div>

              {/* Inner Glowing AI Emblem */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: 62, marginBottom: 8, filter: 'drop-shadow(0 0 20px #38BDF8)' }}>⚡</div>
                <div style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  FirstStep AI
                </div>
                <div style={{ fontFamily: 'Figtree', fontSize: 12.5, color: '#38BDF8', fontWeight: 800, marginTop: 4 }}>
                  Moteur Autonome Actif
                </div>
              </div>
            </div>

            {/* Right: Live Automated Action Pipeline Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: 660 }}>
              
              {/* Step 1: Scan Transactions */}
              <div
                style={{
                  padding: '20px 26px',
                  borderRadius: 22,
                  backgroundColor: 'rgba(15, 23, 42, 0.94)',
                  border: '1.5px solid rgba(56, 189, 248, 0.35)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: interpolate(step1Spring, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(step1Spring, [0, 1], [60, 0])}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      backgroundColor: 'rgba(0, 102, 255, 0.25)',
                      color: '#38BDF8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                    }}
                  >
                    🔍
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>
                      1. Rapprochement Bancaire Continu
                    </div>
                    <div style={{ fontFamily: 'Figtree', fontSize: 12.5, color: '#94A3B8', fontWeight: 500 }}>
                      142 transactions synchronisées sans doublon
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: 9999,
                    backgroundColor: 'rgba(16, 185, 129, 0.18)',
                    border: '1px solid #10B981',
                    color: '#34D399',
                    fontFamily: 'Figtree',
                    fontSize: 12.5,
                    fontWeight: 800,
                  }}
                >
                  ✓ Terminé (0.2s)
                </div>
              </div>

              {/* Step 2: Auto Invoice Generation */}
              <div
                style={{
                  padding: '20px 26px',
                  borderRadius: 22,
                  backgroundColor: 'rgba(15, 23, 42, 0.94)',
                  border: '1.5px solid rgba(56, 189, 248, 0.35)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: interpolate(step2Spring, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(step2Spring, [0, 1], [60, 0])}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      backgroundColor: 'rgba(16, 185, 129, 0.25)',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                    }}
                  >
                    📄
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>
                      2. Génération Facture & Calcul TVA
                    </div>
                    <div style={{ fontFamily: 'Figtree', fontSize: 12.5, color: '#94A3B8', fontWeight: 500 }}>
                      Facture #FS-2026-894 calculée & certifiée
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: 9999,
                    backgroundColor: 'rgba(16, 185, 129, 0.18)',
                    border: '1px solid #10B981',
                    color: '#34D399',
                    fontFamily: 'Figtree',
                    fontSize: 12.5,
                    fontWeight: 800,
                  }}
                >
                  ✓ Validé
                </div>
              </div>

              {/* Step 3: WhatsApp Notification */}
              <div
                style={{
                  padding: '20px 26px',
                  borderRadius: 22,
                  backgroundColor: 'rgba(15, 23, 42, 0.94)',
                  border: '1.5px solid rgba(16, 185, 129, 0.5)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.4), 0 0 25px rgba(37, 211, 102, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: interpolate(step3Spring, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(step3Spring, [0, 1], [60, 0])}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      backgroundColor: 'rgba(37, 211, 102, 0.25)',
                      color: '#25D366',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                    }}
                  >
                    💬
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>
                      3. Notification WhatsApp & Lien de Paiement
                    </div>
                    <div style={{ fontFamily: 'Figtree', fontSize: 12.5, color: '#94A3B8', fontWeight: 500 }}>
                      Envoyé instantanément au smartphone du client
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: 9999,
                    backgroundColor: 'rgba(37, 211, 102, 0.25)',
                    border: '1px solid #25D366',
                    color: '#25D366',
                    fontFamily: 'Figtree',
                    fontSize: 12.5,
                    fontWeight: 800,
                  }}
                >
                  ✓ Reçu (10:42)
                </div>
              </div>

            </div>
          </div>
        </AbsoluteFill>

        {/* Celebration Success Toast */}
        {celebrationSpring > 0 && (
          <AbsoluteFill
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 820,
              zIndex: 40,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                padding: '14px 34px',
                borderRadius: 9999,
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontFamily: 'Syne, sans-serif',
                fontSize: 18,
                fontWeight: 800,
                boxShadow: '0 15px 45px rgba(16, 185, 129, 0.6), 0 0 30px rgba(52, 211, 153, 0.4)',
                opacity: interpolate(celebrationSpring, [0, 1], [0, 1]),
                transform: `scale(${interpolate(celebrationSpring, [0, 1], [0.8, 1])})`,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <span>🎉</span>
              <span>Opérations 100% automatisées en temps réel !</span>
            </div>
          </AbsoluteFill>
        )}
      </CameraRig>
    </AbsoluteFill>
  );
};
