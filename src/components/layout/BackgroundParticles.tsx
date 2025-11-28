import { cx } from '@/lib/cx'

type ParticleSpec = {
  top: string
  left: string
  size: number
  colorVar: string
  tint: number
  opacity: number
  animation: 'animate-soft-drift' | 'animate-soft-bob'
  delay: number
  duration: number
}

const particles: ParticleSpec[] = [
  { top: '6%', left: '5%', size: 220, colorVar: '--color-lavender', tint: 0.32, opacity: 0.85, animation: 'animate-soft-drift', delay: 0, duration: 32 },
  { top: '18%', left: '70%', size: 180, colorVar: '--color-blush', tint: 0.35, opacity: 0.75, animation: 'animate-soft-bob', delay: 3, duration: 26 },
  { top: '65%', left: '8%', size: 200, colorVar: '--color-mint', tint: 0.35, opacity: 0.7, animation: 'animate-soft-bob', delay: 2, duration: 28 },
  { top: '58%', left: '65%', size: 260, colorVar: '--color-lavender', tint: 0.28, opacity: 0.8, animation: 'animate-soft-drift', delay: 4, duration: 34 },
  { top: '35%', left: '40%', size: 140, colorVar: '--color-peach', tint: 0.4, opacity: 0.65, animation: 'animate-soft-drift', delay: 1, duration: 22 },
  { top: '80%', left: '75%', size: 210, colorVar: '--color-blush', tint: 0.3, opacity: 0.75, animation: 'animate-soft-bob', delay: 5, duration: 30 },
]

export function BackgroundParticles() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="pixel-background" />
      {particles.map((particle, index) => (
        <span
          key={`${particle.top}-${particle.left}-${index}`}
          className={cx('particle-base', particle.animation)}
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: `radial-gradient(circle, rgba(var(${particle.colorVar}), ${particle.tint}) 0%, transparent 70%)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
