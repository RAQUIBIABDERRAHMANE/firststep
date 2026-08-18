import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { KineticText } from '../components/KineticText';
import { GlassCard } from '../components/GlassCard';
import { AnimatedCursor } from '../components/AnimatedCursor';
import { CameraRig } from '../components/CameraRig';

export const Scene3Analytics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Active tab switches from '30d' to '90d' at frame 65
  const is90d = frame >= 65;

  // Chart drawing animation
  const chartDrawProgress = interpolate(frame, [10, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ticking Revenue Metric
  const revenueValue = is90d
    ? Math.round(interpolate(frame, [65, 105], [142850, 485200], { extrapolateRight: 'clamp' }))
    : Math.round(interpolate(frame, [0, 35], [0, 142850], { extrapolateRight: 'clamp' }));

  const growthText = is90d ? '+32.8%' : '+18.4%';
  const peakVal = is90d ? '14 200 MAD' : '8 450 MAD';
  const peakDate = is90d ? '25 mai' : '13 mai';

  // Morphing SVG paths
  const path30d = 'M 0,90 Q 60,30 120,60 T 240,20 T 360,80 T 480,30 T 600,45';
  const path90d = 'M 0,110 Q 80,20 160,70 T 300,15 T 440,50 T 520,20 T 600,15';

  const fill30d = 'M 0,90 Q 60,30 120,60 T 240,20 T 360,80 T 480,30 T 600,45 L 600,160 L 0,160 Z';
  const fill90d = 'M 0,110 Q 80,20 160,70 T 300,15 T 440,50 T 520,20 T 600,15 L 600,160 L 0,160 Z';

  const chartPath = is90d ? path90d : path30d;
  const chartFill = is90d ? fill90d : fill30d;

  // Donut chart stroke animation
  const donutProgress = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig zoomRange={[0.98, 1.04]} tiltXRange={[5, 0]} tiltYRange={[-3, 3]} duration={210}>
        <BackgroundGlow theme="light" />

        {/* Top Kinetic Headline */}
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
            📈 Intelligence Financière & Trésorerie Live
          </div>

          <KineticText
            text="PILOTEZ VOTRE TRÉSORERIE ET VOS PERFORMANCES EN TEMPS RÉEL"
            highlightWords={['EN TEMPS RÉEL']}
            annotationType="underline"
            annotationColor="#0066FF"
            highlightColor="#0066FF"
            color="#0F172A"
            fontSize={60}
            subtitle="Synchronisation bancaire continue, prévisions de cash-flow et collaboration multi-utilisateurs."
          />
        </AbsoluteFill>

        {/* Center 3D Dashboard Main Widget */}
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 310,
            zIndex: 20,
          }}
        >
          <GlassCard
            name="Finance Dashboard Widget"
            delay={8}
            width={1220}
            height={500}
            tiltX={6}
            tiltY={-3}
            padding={36}
            highlightBorder
          >
            {/* Header row: Title + Live Filter Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 20,
                borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'Syne, Outfit, sans-serif',
                    fontSize: 23,
                    fontWeight: 800,
                    color: '#0F172A',
                  }}
                >
                  Évolution du Chiffre d'Affaires & Encaissements
                </div>
                <div
                  style={{
                    fontFamily: 'Figtree, sans-serif',
                    fontSize: 13,
                    color: '#64748B',
                    fontWeight: 500,
                  }}
                >
                  Rapprochement bancaire en direct · Zéro décalage de trésorerie
                </div>
              </div>

              {/* Time Filter Pills */}
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  backgroundColor: '#F1F5F9',
                  padding: 6,
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                }}
              >
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Figtree, sans-serif',
                    color: '#64748B',
                  }}
                >
                  7 jours
                </div>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Figtree, sans-serif',
                    backgroundColor: !is90d ? '#FFFFFF' : 'transparent',
                    color: !is90d ? '#0066FF' : '#64748B',
                    boxShadow: !is90d ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  30 jours
                </div>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Figtree, sans-serif',
                    backgroundColor: is90d ? '#0066FF' : 'transparent',
                    color: is90d ? '#FFFFFF' : '#64748B',
                    boxShadow: is90d ? '0 4px 14px rgba(0, 102, 255, 0.4)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  90 jours
                </div>
              </div>
            </div>

            {/* Metric + Chart Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr 300px', gap: 32 }}>
              
              {/* Left Big Metric Column */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div
                  style={{
                    fontFamily: 'Figtree, sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Total des Encaissements
                </div>
                <div
                  style={{
                    fontFamily: 'Syne, Outfit, sans-serif',
                    fontSize: 44,
                    fontWeight: 900,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                    marginTop: 6,
                  }}
                >
                  {revenueValue.toLocaleString('fr-FR')} MAD
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 8,
                    fontFamily: 'Figtree, sans-serif',
                    fontSize: 14.5,
                    fontWeight: 800,
                    color: '#10B981',
                  }}
                >
                  <span>↗ {growthText}</span>
                  <span style={{ color: '#94A3B8', fontWeight: 500 }}>vs période préc.</span>
                </div>

                {/* Status Badge */}
                <div
                  style={{
                    marginTop: 24,
                    padding: '10px 16px',
                    borderRadius: 14,
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#047857',
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Figtree, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: '#10B981' }} />
                  Marge nette certifiée: +28.4%
                </div>
              </div>

              {/* Center Area & Spline Chart */}
              <div style={{ position: 'relative', height: 260 }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 600 160"
                  preserveAspectRatio="none"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="chartGradNeon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0066FF" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#0066FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid horizontal lines */}
                  <line x1="0" y1="30" x2="600" y2="30" stroke="#E2E8F0" strokeWidth="1" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="#E2E8F0" strokeWidth="1" />
                  <line x1="0" y1="130" x2="600" y2="130" stroke="#E2E8F0" strokeWidth="1" />

                  {/* Gradient Area Fill */}
                  <path
                    d={chartFill}
                    fill="url(#chartGradNeon)"
                    opacity={chartDrawProgress}
                  />

                  {/* Main Spline Curve */}
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="#0066FF"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray={1200}
                    strokeDashoffset={interpolate(chartDrawProgress, [0, 1], [1200, 0])}
                  />

                  {/* Animated Peak Node */}
                  <circle
                    cx={is90d ? 520 : 360}
                    cy={is90d ? 20 : 80}
                    r="8"
                    fill="#0066FF"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(0, 102, 255, 0.6))',
                    }}
                  />
                </svg>

                {/* Peak Tooltip Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: is90d ? -15 : 45,
                    left: is90d ? '78%' : '52%',
                    padding: '7px 16px',
                    borderRadius: 14,
                    backgroundColor: '#0066FF',
                    color: '#FFFFFF',
                    fontFamily: 'Figtree, sans-serif',
                    fontSize: 12.5,
                    fontWeight: 800,
                    boxShadow: '0 10px 25px rgba(0, 102, 255, 0.45)',
                    whiteSpace: 'nowrap',
                    transform: 'translateX(-50%)',
                  }}
                >
                  {peakDate} · {peakVal} 🚀
                </div>
              </div>

              {/* Right Profitability Breakdown Widget */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 22,
                  padding: 22,
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                    Ratios Financiers
                  </div>
                  <div style={{ fontFamily: 'Figtree', fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    Santé d'entreprise
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: 'Figtree', fontWeight: 800 }}>
                      <span>Marge Brute</span>
                      <span style={{ color: '#0066FF' }}>45%</span>
                    </div>
                    <div style={{ height: 7, width: '100%', backgroundColor: '#E2E8F0', borderRadius: 9999, marginTop: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${donutProgress * 45}%`, backgroundColor: '#0066FF' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: 'Figtree', fontWeight: 800 }}>
                      <span>EBITDA</span>
                      <span style={{ color: '#10B981' }}>26%</span>
                    </div>
                    <div style={{ height: 7, width: '100%', backgroundColor: '#E2E8F0', borderRadius: 9999, marginTop: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${donutProgress * 26}%`, backgroundColor: '#10B981' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontFamily: 'Figtree', fontWeight: 800 }}>
                      <span>Marge Nette</span>
                      <span style={{ color: '#0284C7' }}>18%</span>
                    </div>
                    <div style={{ height: 7, width: '100%', backgroundColor: '#E2E8F0', borderRadius: 9999, marginTop: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${donutProgress * 18}%`, backgroundColor: '#0284C7' }} />
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 11.5, color: '#10B981', fontWeight: 800, fontFamily: 'Figtree', marginTop: 8 }}>
                  ✓ Trésorerie saine & positive
                </div>
              </div>
            </div>
          </GlassCard>
        </AbsoluteFill>

        {/* Collaborative Cursor 1: Directeur */}
        <AnimatedCursor
          name="Directeur"
          role="Directeur Général"
          avatarChar="D"
          color="#0066FF"
          path={[
            { frame: 10, x: 400, y: 780 },
            { frame: 58, x: 1380, y: 440, label: 'Change la période' },
            { frame: 65, x: 1380, y: 440, click: true, label: '90 jours activé!' },
            { frame: 120, x: 1020, y: 550, label: 'Analyse la croissance' },
            { frame: 195, x: 800, y: 820 },
          ]}
        />

        {/* Collaborative Cursor 2: CFO */}
        <AnimatedCursor
          name="CFO"
          role="Directeur Financier"
          avatarChar="C"
          color="#10B981"
          path={[
            { frame: 35, x: 1620, y: 820 },
            { frame: 105, x: 1400, y: 640, label: 'Inspecte EBITDA' },
            { frame: 120, x: 1400, y: 640, click: true, label: 'Ratios validés ✓' },
            { frame: 185, x: 1200, y: 740 },
          ]}
        />
      </CameraRig>
    </AbsoluteFill>
  );
};
