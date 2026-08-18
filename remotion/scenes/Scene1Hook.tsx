import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Interactive } from 'remotion';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { KineticText } from '../components/KineticText';
import { CameraRig } from '../components/CameraRig';

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Chaotic vibration frequency
  const shake1 = Math.sin(frame * 0.9) * 4;
  const shake2 = Math.cos(frame * 1.1) * 5;
  const shake3 = Math.sin(frame * 1.3) * 4.5;
  const shake4 = Math.cos(frame * 0.8) * 3.5;

  // Implosion / black-hole vortex suction starting around frame 105
  const implosionSpring = spring({
    frame: frame - 105,
    fps,
    config: { damping: 13, mass: 0.75, stiffness: 140 },
  });

  const cardsScale = interpolate(implosionSpring, [0, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardsOpacity = interpolate(implosionSpring, [0, 0.7, 1], [1, 0.7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const vortexGlow = interpolate(implosionSpring, [0, 0.6, 1], [0, 0.9, 1]);

  const cards = [
    {
      id: 'excel',
      icon: '📊',
      bg: '#EF4444',
      title: 'Fichier_Ventes_v4_FINAL(2).xlsx',
      desc: '⚠️ Erreur formule : Données désynchronisées',
      x: '10%',
      y: '48%',
      rotate: -7,
      shake: shake1,
    },
    {
      id: 'invoices',
      icon: '🧾',
      bg: '#F59E0B',
      title: 'Factures non rapprochées',
      desc: '-34 000 MAD en souffrance client',
      x: '62%',
      y: '44%',
      rotate: 6,
      shake: shake2,
    },
    {
      id: 'messages',
      icon: '💬',
      bg: '#DC2626',
      title: '52 messages WhatsApp en attente',
      desc: 'Commandes perdues entre les fils de discussion',
      x: '18%',
      y: '72%',
      rotate: -4,
      shake: shake3,
    },
    {
      id: 'pos',
      icon: '💳',
      bg: '#9333EA',
      title: 'Caisse déconnectée du stock',
      desc: 'Rupture imprévue sur 14 articles phares',
      x: '65%',
      y: '70%',
      rotate: 5,
      shake: shake4,
    },
    {
      id: 'tax',
      icon: '🏛️',
      bg: '#E11D48',
      title: 'Déclaration TVA urgente',
      desc: '3 jours restants · Rapprochement incomplet',
      x: '40%',
      y: '84%',
      rotate: 2,
      shake: shake1,
    },
  ];

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig zoomRange={[1, 1.08]} tiltXRange={[0, 4]} duration={150}>
        <BackgroundGlow theme="chaos" />

        {/* Center Kinetic Headline */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 100,
            zIndex: 30,
          }}
        >
          {/* Warning Badge */}
          <Interactive.Div
            name="Warning Badge"
            style={{
              padding: '8px 22px',
              borderRadius: 9999,
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1.5px solid rgba(239, 68, 68, 0.5)',
              color: '#FCA5A5',
              fontFamily: 'Figtree, Inter, sans-serif',
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 20,
              boxShadow: '0 4px 25px rgba(239, 68, 68, 0.3)',
              opacity: interpolate(frame, [0, 15], [0, 1]),
              transform: `scale(${interpolate(frame, [0, 15], [0.85, 1])})`,
            }}
          >
            ⚠️ La réalité des entreprises non digitalisées
          </Interactive.Div>

          <KineticText
            text="GÉRER VOTRE BUSINESS NE DEVRAIT PAS ÊTRE UN CHAOS"
            highlightWords={['CHAOS']}
            annotationType="circle"
            annotationColor="#EF4444"
            highlightColor="#EF4444"
            color="#FFFFFF"
            fontSize={72}
            subtitle="Fichiers Excel perdus, factures égarées, outils fragmentés, temps précieux gaspillé..."
          />
        </AbsoluteFill>

        {/* Floating Chaotic Cards Storm */}
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            zIndex: 25,
            opacity: cardsOpacity,
            transform: `scale(${cardsScale})`,
          }}
        >
          {cards.map((card, idx) => (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                left: card.x,
                top: card.y,
                padding: '18px 26px',
                borderRadius: 22,
                backgroundColor: 'rgba(15, 23, 42, 0.94)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 20px rgba(239, 68, 68, 0.2)',
                color: '#FFFFFF',
                fontFamily: 'Figtree, sans-serif',
                transform: `translate(${card.shake}px, ${card.shake * 0.8}px) rotate(${card.rotate}deg)`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                maxWidth: 440,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  boxShadow: `0 4px 15px ${card.bg}66`,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{card.title}</div>
                <div style={{ fontSize: 12.5, color: '#FDA4AF', fontWeight: 600, marginTop: 2 }}>
                  {card.desc}
                </div>
              </div>
            </div>
          ))}
        </AbsoluteFill>

        {/* Center Gravitational Singularity Light Burst */}
        {vortexGlow > 0 && (
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: interpolate(vortexGlow, [0, 1], [60, 1400]),
                height: interpolate(vortexGlow, [0, 1], [60, 1400]),
                borderRadius: 9999,
                background: 'radial-gradient(circle, #0066FF 0%, #38BDF8 35%, #10B981 65%, transparent 75%)',
                opacity: vortexGlow,
                filter: 'blur(50px)',
              }}
            />
          </AbsoluteFill>
        )}
      </CameraRig>
    </AbsoluteFill>
  );
};
