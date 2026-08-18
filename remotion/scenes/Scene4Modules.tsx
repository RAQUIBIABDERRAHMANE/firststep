import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { KineticText } from '../components/KineticText';
import { AnimatedCursor } from '../components/AnimatedCursor';
import { CameraRig } from '../components/CameraRig';

export const Scene4Modules: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Toggle switch activation on Restaurant card at frame 68
  const isToggled = frame >= 68;
  const toggleSpring = spring({
    frame: frame - 68,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 200 },
  });

  // Laser scanner beam animation on Restaurant card
  const scannerY = interpolate(frame % 45, [0, 45], [0, 140]);

  const modules = [
    {
      icon: '🍽️',
      title: 'Restaurant & Café',
      badge: 'Pack Complet',
      features: ['Menu QR & Commande', 'Écran Cuisine KDS', 'Caisse Tactile POS'],
      price: '349 MAD/m',
      delay: 8,
      active: true,
      color: '#0066FF',
    },
    {
      icon: '🏪',
      title: 'Commerce & Retail',
      badge: 'Gestion Stock',
      features: ['Scanner Code-barres', 'Multi-entrepôts', 'Alertes Rupture Auto'],
      price: '299 MAD/m',
      delay: 18,
      active: true,
      color: '#0284C7',
    },
    {
      icon: '🚗',
      title: 'Location & Flotte',
      badge: 'Planning Live',
      features: ['Contrats Digitaux', 'Caution & Paiement', 'Disponibilité 24/7'],
      price: '399 MAD/m',
      delay: 28,
      active: false,
      color: '#10B981',
    },
    {
      icon: '💼',
      title: 'Services & Cabinets',
      badge: 'Facturation Pro',
      features: ['Devis en 1 clic', 'Signature Électronique', 'Portail Client Dédié'],
      price: '249 MAD/m',
      delay: 38,
      active: false,
      color: '#8B5CF6',
    },
  ];

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig zoomRange={[0.97, 1.05]} tiltXRange={[6, 0]} tiltYRange={[-4, 4]} duration={210}>
        <BackgroundGlow theme="light" />

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
              backgroundColor: 'rgba(0, 102, 255, 0.1)',
              border: '1px solid rgba(0, 102, 255, 0.25)',
              color: '#0066FF',
              fontFamily: 'Figtree, sans-serif',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            🧩 Écosystème Métier Modulaire & Évolutif
          </div>

          <KineticText
            text="DES MODULES SUR MESURE POUR CHAQUE MÉTIER"
            highlightWords={['SUR MESURE']}
            annotationType="highlight"
            annotationColor="#38BDF8"
            highlightColor="#0066FF"
            color="#0F172A"
            fontSize={64}
            subtitle="Activez seulement ce dont vous avez besoin. Zéro surcharge, flexibilité totale."
          />
        </AbsoluteFill>

        {/* 3D 4-Card Industry Carousel */}
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 310,
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 350px)',
              gap: 24,
              perspective: 1200,
            }}
          >
            {modules.map((mod, i) => {
              const cardSpring = spring({
                frame: frame - mod.delay,
                fps,
                config: { damping: 14, mass: 0.8, stiffness: 130 },
              });

              const isCurrentToggled = i === 0 ? isToggled : mod.active;

              return (
                <div
                  key={i}
                  style={{
                    transform: `perspective(1000px) translateY(${interpolate(
                      cardSpring,
                      [0, 1],
                      [90, 0]
                    )}px) scale(${interpolate(cardSpring, [0, 1], [0.86, 1])}) rotateY(${
                      i === 0 ? -5 : i === 3 ? 5 : i === 1 ? -2 : 2
                    }deg)`,
                    opacity: interpolate(cardSpring, [0, 1], [0, 1]),
                    borderRadius: 26,
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(20px)',
                    border: isCurrentToggled
                      ? `2.5px solid ${mod.color}`
                      : '1px solid rgba(226, 232, 240, 0.95)',
                    boxShadow: isCurrentToggled
                      ? `0 24px 50px -10px ${mod.color}38, 0 10px 25px -5px rgba(0,0,0,0.06)`
                      : '0 18px 40px -10px rgba(0,0,0,0.08)',
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: 410,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Highlight Glow bar for active card */}
                  {isCurrentToggled && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 5,
                        background: `linear-gradient(90deg, ${mod.color}, #38BDF8)`,
                      }}
                    />
                  )}

                  {/* Card Top: Icon & Switch */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 18,
                          backgroundColor: `${mod.color}15`,
                          border: `1.5px solid ${mod.color}35`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 28,
                          boxShadow: `0 4px 12px ${mod.color}25`,
                        }}
                      >
                        {mod.icon}
                      </div>

                      {/* Interactive Toggle Switch */}
                      <div
                        style={{
                          width: 54,
                          height: 30,
                          borderRadius: 9999,
                          backgroundColor: isCurrentToggled ? '#10B981' : '#E2E8F0',
                          padding: 3,
                          display: 'flex',
                          alignItems: 'center',
                          boxShadow: isCurrentToggled ? '0 0 14px rgba(16, 185, 129, 0.5)' : 'none',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 9999,
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                            transform: `translateX(${
                              i === 0
                                ? interpolate(toggleSpring, [0, 1], [0, 24])
                                : isCurrentToggled
                                ? 24
                                : 0
                            }px)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Title & Badge */}
                    <div
                      style={{
                        fontFamily: 'Syne, Outfit, sans-serif',
                        fontSize: 21,
                        fontWeight: 800,
                        color: '#0F172A',
                      }}
                    >
                      {mod.title}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        marginTop: 4,
                        padding: '3px 10px',
                        borderRadius: 8,
                        backgroundColor: `${mod.color}12`,
                        color: mod.color,
                        fontSize: 11.5,
                        fontWeight: 700,
                        fontFamily: 'Figtree, sans-serif',
                      }}
                    >
                      {mod.badge}
                    </div>

                    {/* Features Bullet List */}
                    <div
                      style={{
                        marginTop: 18,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 9,
                      }}
                    >
                      {mod.features.map((feat, fidx) => (
                        <div
                          key={fidx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 9,
                            fontSize: 13.5,
                            fontFamily: 'Figtree, sans-serif',
                            color: '#475569',
                            fontWeight: 600,
                          }}
                        >
                          <span style={{ color: '#10B981', fontWeight: 900 }}>✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Price + Activation State */}
                  <div
                    style={{
                      paddingTop: 16,
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Syne', color: '#0F172A' }}>
                        {mod.price}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '5px 12px',
                        borderRadius: 9999,
                        backgroundColor: isCurrentToggled ? '#ECFDF5' : '#F1F5F9',
                        color: isCurrentToggled ? '#059669' : '#64748B',
                        fontSize: 11.5,
                        fontWeight: 800,
                        fontFamily: 'Figtree, sans-serif',
                        border: isCurrentToggled ? '1px solid #A7F3D0' : 'none',
                      }}
                    >
                      {isCurrentToggled ? 'Module Déployé' : 'Activable'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>

        {/* Collaborative Cursor: Manager flipping the switch */}
        <AnimatedCursor
          name="Responsable"
          role="Responsable Opérations"
          avatarChar="R"
          color="#0284C7"
          path={[
            { frame: 15, x: 200, y: 720 },
            { frame: 62, x: 575, y: 460, label: 'Active le module Restaurant' },
            { frame: 68, x: 575, y: 460, click: true, label: 'Module En Ligne ✓' },
            { frame: 130, x: 940, y: 460, label: 'Vérifie le Stock Retail' },
            { frame: 195, x: 1420, y: 680 },
          ]}
        />
      </CameraRig>
    </AbsoluteFill>
  );
};
