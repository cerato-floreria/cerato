'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

// Static deterministic petal positions and variations (avoids hydration mismatch)
interface PetalConfig {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  rot: number;
  sway: number;
  color: string;
}

const PETALS: PetalConfig[] = [
  { id: 1, left: 3, size: 24, delay: 0.05, duration: 1.4, rot: 180, sway: -25, color: '#C4B5FD' },
  { id: 2, left: 7, size: 20, delay: 0.2, duration: 1.6, rot: -140, sway: 20, color: '#E9D5FF' },
  { id: 3, left: 12, size: 28, delay: 0.1, duration: 1.35, rot: 220, sway: -15, color: '#D4AF37' },
  { id: 4, left: 16, size: 22, delay: 0.35, duration: 1.5, rot: 160, sway: 30, color: '#C4B5FD' },
  { id: 5, left: 20, size: 32, delay: 0.15, duration: 1.3, rot: -200, sway: -20, color: '#FDFBF7' },
  { id: 6, left: 25, size: 24, delay: 0.4, duration: 1.55, rot: 240, sway: 25, color: '#E9D5FF' },
  { id: 7, left: 29, size: 26, delay: 0.05, duration: 1.45, rot: -180, sway: -30, color: '#D4AF37' },
  { id: 8, left: 34, size: 22, delay: 0.25, duration: 1.6, rot: 210, sway: 15, color: '#C4B5FD' },
  { id: 9, left: 38, size: 30, delay: 0.1, duration: 1.38, rot: -160, sway: -22, color: '#FDFBF7' },
  { id: 10, left: 43, size: 24, delay: 0.3, duration: 1.42, rot: 260, sway: 28, color: '#E9D5FF' },
  { id: 11, left: 47, size: 26, delay: 0.18, duration: 1.5, rot: -220, sway: -18, color: '#D4AF37' },
  { id: 12, left: 52, size: 34, delay: 0.05, duration: 1.35, rot: 190, sway: 22, color: '#C4B5FD' },
  { id: 13, left: 56, size: 22, delay: 0.28, duration: 1.58, rot: -170, sway: -26, color: '#E9D5FF' },
  { id: 14, left: 61, size: 28, delay: 0.12, duration: 1.4, rot: 230, sway: 24, color: '#FDFBF7' },
  { id: 15, left: 65, size: 24, delay: 0.38, duration: 1.52, rot: -190, sway: -16, color: '#D4AF37' },
  { id: 16, left: 70, size: 30, delay: 0.22, duration: 1.36, rot: 210, sway: 30, color: '#C4B5FD' },
  { id: 17, left: 74, size: 20, delay: 0.08, duration: 1.62, rot: -250, sway: -20, color: '#E9D5FF' },
  { id: 18, left: 79, size: 26, delay: 0.32, duration: 1.48, rot: 170, sway: 25, color: '#FDFBF7' },
  { id: 19, left: 83, size: 32, delay: 0.16, duration: 1.32, rot: -210, sway: -28, color: '#D4AF37' },
  { id: 20, left: 88, size: 22, delay: 0.42, duration: 1.54, rot: 240, sway: 18, color: '#C4B5FD' },
  { id: 21, left: 92, size: 28, delay: 0.14, duration: 1.44, rot: -180, sway: -22, color: '#E9D5FF' },
  { id: 22, left: 96, size: 24, delay: 0.26, duration: 1.5, rot: 200, sway: 26, color: '#FDFBF7' },
  // Second wave with offset for denser curtain effect
  { id: 23, left: 6, size: 22, delay: 0.45, duration: 1.45, rot: 150, sway: 18, color: '#D4AF37' },
  { id: 24, left: 18, size: 28, delay: 0.5, duration: 1.38, rot: -230, sway: -25, color: '#C4B5FD' },
  { id: 25, left: 32, size: 24, delay: 0.48, duration: 1.52, rot: 210, sway: 22, color: '#E9D5FF' },
  { id: 26, left: 44, size: 30, delay: 0.52, duration: 1.35, rot: -190, sway: -20, color: '#FDFBF7' },
  { id: 27, left: 58, size: 26, delay: 0.46, duration: 1.42, rot: 250, sway: 28, color: '#D4AF37' },
  { id: 28, left: 72, size: 24, delay: 0.54, duration: 1.5, rot: -170, sway: -18, color: '#C4B5FD' },
  { id: 29, left: 84, size: 28, delay: 0.48, duration: 1.4, rot: 220, sway: 24, color: '#E9D5FF' },
  { id: 30, left: 94, size: 20, delay: 0.52, duration: 1.55, rot: -210, sway: -22, color: '#FDFBF7' },
];

/**
 * Petal SVG rendering the exact 5-petal rotational symmetry from public/icon.svg
 */
const PetalIcon = ({
  size = 32,
  fill = '#C4B5FD',
  className = '',
}: {
  size?: number;
  fill?: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    style={{ overflow: 'visible' }}
    aria-hidden="true"
  >
    <g transform="translate(50, 50) scale(0.85) translate(-51.5, -49.5)">
      <g transform="translate(0, 100) scale(0.1, -0.1)" fill={fill}>
        <use href="#cerato-loader-petal" />
        <use href="#cerato-loader-petal" transform="rotate(72 515 505)" />
        <use href="#cerato-loader-petal" transform="rotate(144 515 505)" />
        <use href="#cerato-loader-petal" transform="rotate(216 515 505)" />
        <use href="#cerato-loader-petal" transform="rotate(288 515 505)" />
      </g>
    </g>
  </svg>
);

const SESSION_STORAGE_KEY = 'cerato_first_visit_loader_shown';

export default function InitialLoader() {
  const [phase, setPhase] = useState<'pulse' | 'rain' | 'curtain' | 'done'>('pulse');

  // Dismiss and clean up completely
  const dismissLoader = useCallback(() => {
    setPhase('curtain');
    setTimeout(() => {
      setPhase('done');
      document.documentElement.classList.add('cerato-loader-done');
      document.documentElement.classList.remove('cerato-loading');
      document.body.style.overflow = '';
    }, 750);
  }, []);

  useEffect(() => {
    try {
      // 1. Only show once per session to maintain optimal UX
      const alreadyShown = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (alreadyShown || prefersReduced) {
        document.documentElement.classList.add('cerato-loader-done');
        document.documentElement.classList.remove('cerato-loading');
        setPhase('done');
        return;
      }

      // Mark as shown immediately
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      document.documentElement.classList.add('cerato-loading');

      // Choreographed timeline:
      // T = 0.0s - 2.8s : Logo pulse & breathe (+1s duration)
      // T = 2.8s        : Petal rain cascade starts
      // T = 3.4s        : Curtain slides down revealing page
      // T = 4.25s       : Unmount completely from DOM
      const timerRain = setTimeout(() => {
        setPhase('rain');
      }, 2800);

      const timerCurtain = setTimeout(() => {
        setPhase('curtain');
      }, 3400);

      const timerDone = setTimeout(() => {
        setPhase('done');
        document.documentElement.classList.add('cerato-loader-done');
        document.documentElement.classList.remove('cerato-loading');
        document.body.style.overflow = '';
      }, 4250);

      return () => {
        clearTimeout(timerRain);
        clearTimeout(timerCurtain);
        clearTimeout(timerDone);
        document.documentElement.classList.add('cerato-loader-done');
        document.documentElement.classList.remove('cerato-loading');
        document.body.style.overflow = '';
      };
    } catch {
      setPhase('done');
    }
  }, []);

  // When animation finishes, completely unmount from DOM
  if (phase === 'done') {
    return null;
  }

  const isCurtainDown = phase === 'curtain';

  return (
    <div
      id="cerato-initial-loader"
      role="status"
      aria-live="polite"
      aria-label="Cargando experiencia Cerato Arte Floral"
      onClick={dismissLoader}
      className={`fixed inset-0 z-[9999] select-none transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isCurtainDown ? 'translate-y-full pointer-events-none' : 'translate-y-0'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 45%, #35152D 0%, #241228 60%, #150812 100%)',
        boxShadow: isCurtainDown ? '0 -25px 60px rgba(0,0,0,0.6)' : 'none',
      }}
    >
      {/* Shared SVG Defs for petal geometry (loaded once, referenced everywhere) */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <path
            id="cerato-loader-petal"
            d="M327 961 c-29 -26 -32 -35 -32 -83 0 -49 5 -61 61 -143 34 -50 67 -101 73 -115 12 -25 12 -25 -6 -4 -10 12 -43 52 -74 90 -68 84 -85 99 -124 114 -22 8 5 -24 103 -123 133 -133 133 -133 193 -132 61 2 61 2 197 140 128 129 135 137 102 131 -42 -8 -72 -36 -156 -143 -36 -46 -67 -83 -70 -83 -7 0 30 62 73 121 67 94 82 177 41 222 -22 24 -29 25 -186 31 -162 5 -162 5 -195 -23z m161 -26 c2 -2 9 -52 15 -112 11 -106 12 -107 18 -53 4 30 7 81 8 113 1 57 1 57 69 57 75 0 92 -9 92 -52 0 -33 -18 -70 -70 -148 -20 -30 -47 -74 -59 -97 -36 -71 -53 -62 -145 78 -90 136 -100 175 -56 211 20 16 33 18 74 13 28 -4 52 -9 54 -10z"
          />
        </defs>
      </svg>

      {/* Subtle background ambient lighting glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Central Large Logo with breathing pulse effect */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ${
          phase === 'pulse' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="relative flex flex-col items-center">
          {/* Pulsing Flower (Only this element pulses) */}
          <div className="relative flex items-center justify-center">
            {/* Luminous halo concentrated around the pulsing flower */}
            <div className="absolute -inset-6 bg-radial from-accent-gold/25 via-[#C4B5FD]/15 to-transparent blur-xl rounded-full pointer-events-none" />
            
            <div className="relative animate-cerato-pulse">
              <PetalIcon size={100} fill="#E9D5FF" />
            </div>
          </div>

          {/* Original Brand Logo Typography (without flower, stays static) */}
          <div className="mt-4 sm:mt-5 flex items-center justify-center">
            <Image
              src="/logo-text-1.png"
              alt="Cerato Arte Floral"
              width={720}
              height={235}
              priority
              className="w-56 sm:w-64 md:w-72 h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>
      </div>

      {/* Falling Petals Curtain Rain */}
      {phase !== 'pulse' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PETALS.map((petal) => (
            <div
              key={petal.id}
              className="absolute animate-petal-rain"
              style={
                {
                  left: `${petal.left}%`,
                  top: '-50px',
                  '--dur': `${petal.duration}s`,
                  '--delay': `${petal.delay}s`,
                  '--rot': `${petal.rot}deg`,
                  '--sway': `${petal.sway}px`,
                } as React.CSSProperties
              }
            >
              <PetalIcon size={petal.size} fill={petal.color} />
            </div>
          ))}
        </div>
      )}

      {/* Decorative curtain bottom trim line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />
    </div>
  );
}
