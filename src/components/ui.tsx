import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  backTo,
  action,
}: {
  eyebrow?: string
  title: string
  subtitle?: ReactNode
  backTo?: string
  action?: ReactNode
}) {
  return (
    <header className="flex justify-between items-start mb-6 gap-3">
      <div className="min-w-0">
        {backTo && (
          <Link
            to={backTo}
            className="inline-flex items-center gap-1 text-xs font-bold text-lavo-muted mb-2"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            VOLTAR
          </Link>
        )}
        {eyebrow && (
          <div className="inline-block -rotate-2 bg-lavo-ink px-3 py-1 mb-2">
            <span className="font-display text-[10px] tracking-wider text-lavo-cyan">{eyebrow}</span>
          </div>
        )}
        <h1 className="text-xl font-extrabold truncate">{title}</h1>
        {subtitle && <div className="text-sm text-lavo-muted mt-1">{subtitle}</div>}
      </div>
      {action}
    </header>
  )
}

export function Card({
  children,
  hard,
  className = '',
}: {
  children: ReactNode
  hard?: boolean
  className?: string
}) {
  return (
    <div
      className={`bg-white border-2 border-lavo-ink rounded-[10px] ${hard ? 'shadow-hard-sm' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-lavo-blue text-lavo-paper border-lavo-ink shadow-hard-sm',
  secondary: 'bg-white text-lavo-ink border-lavo-ink',
  danger: 'bg-lavo-red text-white border-lavo-ink',
  ghost: 'bg-transparent text-lavo-ink border-transparent',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...rest}
      className={`px-4 py-2.5 rounded-md border-2 font-display text-xs tracking-wide disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function LinkButton({
  to,
  variant = 'primary',
  className = '',
  children,
}: {
  to: string
  variant?: ButtonVariant
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center px-4 py-2.5 rounded-md border-2 font-display text-xs tracking-wide text-center ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      {...rest}
      className={`w-full px-3 py-2.5 rounded-md border-2 border-lavo-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lavo-blue ${className}`}
    />
  )
}

export type ChipTone = 'live' | 'ok' | 'warn' | 'muted' | 'danger'

const CHIP_CLASSES: Record<ChipTone, string> = {
  live: 'bg-lavo-green text-lavo-ink',
  ok: 'bg-lavo-green text-lavo-ink',
  warn: 'bg-lavo-cyan text-lavo-ink',
  muted: 'bg-stone-200 text-lavo-muted',
  danger: 'bg-lavo-red text-white',
}

export function Chip({ tone, children }: { tone: ChipTone; children: ReactNode }) {
  return (
    <span
      className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border border-lavo-ink/10 ${CHIP_CLASSES[tone]}`}
    >
      {children}
    </span>
  )
}

export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border-2 border-lavo-ink rounded-[10px] px-3 py-3 text-center">
      <p className="font-display text-xl text-lavo-ink">{value}</p>
      <p className="text-[10px] text-lavo-muted uppercase tracking-wide font-bold mt-1">{label}</p>
    </div>
  )
}
