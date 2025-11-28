import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { cx } from '@/lib/cx'

type Accent = 'lavender' | 'mint' | 'blush' | 'ink'

type PixelCardProps<T extends ElementType> = {
  as?: T
  accent?: Accent
  shimmer?: boolean
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>

export function PixelCard<T extends ElementType = 'div'>(props: PixelCardProps<T>) {
  const { as, accent = 'lavender', shimmer = false, className, children, ...rest } = props
  const Component = (as ?? 'div') as ElementType

  return (
    <Component data-accent={accent} className={cx('pixel-card', shimmer && 'shimmer', className)} {...rest}>
      {children}
    </Component>
  )
}
