export type PrimaryNavLink = {
  to: string
  label: string
  icon: string
  end?: boolean
}

export const primaryNavLinks: PrimaryNavLink[] = [
  { to: '/', label: 'Home base', icon: '🏠', end: true },
  { to: '/about', label: 'About our love', icon: '💌' },
]
