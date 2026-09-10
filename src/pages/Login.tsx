import { useState, type FormEvent } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'

function safeNext(raw: string | null): string {
  if (!raw) return '/'
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/'
  return raw
}

const BUBBLES = [
  { size: 'w-3 h-3', tone: 'bg-white/90' },
  { size: 'w-5 h-5', tone: 'bg-lavo-cyan' },
  { size: 'w-4 h-4', tone: 'bg-white/70' },
  { size: 'w-6 h-6', tone: 'bg-lavo-cyan/80' },
  { size: 'w-3.5 h-3.5', tone: 'bg-white/90' },
]

export default function Login() {
  const { session, signInWithEmail, signUpWithEmail } = useAuth()
  const [searchParams] = useSearchParams()
  const next = safeNext(searchParams.get('next'))

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to={next} replace />

  async function handleEmail(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const fn = mode === 'signin' ? signInWithEmail : signUpWithEmail
    const { error: err } = await fn(email, password)
    setBusy(false)
    if (err) setError(err)
  }

  return (
    <div className="min-h-full relative overflow-hidden bg-lavo-blue">
      {/* halftone texture */}
      <div className="absolute inset-0 bg-halftone opacity-40 [background-size:16px_16px]" />

      {/* flat color blocks */}
      <div className="absolute -top-8 -left-8 w-56 h-56 rounded-br-[220px] bg-lavo-aqua" />
      <div className="absolute -bottom-8 -right-8 w-52 h-64 rounded-tl-[200px] bg-lavo-cyan" />

      <div className="relative flex flex-col items-center px-6 pt-16 pb-10">
        <div className="-rotate-3 bg-lavo-ink px-5 py-2 shadow-hard-sm">
          <span className="font-display text-xs tracking-wider text-lavo-cyan">BLOCO DE RUA · BH</span>
        </div>

        <h1 className="font-display text-5xl leading-[0.95] text-lavo-ink mt-6 text-center">
          LAVÔ
          <br />
          TÁ NOVO!
        </h1>

        <div className="flex items-end gap-2 mt-5">
          {BUBBLES.map((b, i) => (
            <span key={i} className={`${b.size} ${b.tone} rounded-full border border-white/40`} />
          ))}
        </div>

        <div className="w-full max-w-sm mt-9 bg-lavo-paper border-[3px] border-lavo-ink rounded-lg shadow-hard-lg p-6">
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setError(null)
              }}
              className={`flex-1 py-2 rounded-md border-2 border-lavo-ink font-display text-[11px] tracking-wider ${
                mode === 'signin' ? 'bg-lavo-ink text-lavo-cyan' : 'bg-white text-lavo-ink'
              }`}
            >
              ENTRAR
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError(null)
              }}
              className={`flex-1 py-2 rounded-md border-2 border-lavo-ink font-display text-[11px] tracking-wider ${
                mode === 'signup' ? 'bg-lavo-ink text-lavo-cyan' : 'bg-white text-lavo-ink'
              }`}
            >
              CRIAR CONTA
            </button>
          </div>

          {mode === 'signin' ? (
            <p className="text-xs text-lavo-ink bg-white border-2 border-lavo-ink rounded-md p-3 mb-4">
              Seu acesso é criado automaticamente quando a diretoria te cadastra — não precisa criar
              conta. O <strong>login é o seu e-mail</strong> e a <strong>senha são os 4 últimos
              dígitos do seu WhatsApp</strong>. Depois de entrar, dá pra trocar a senha quando quiser
              em "Trocar senha".
            </p>
          ) : (
            <p className="text-xs text-lavo-ink bg-white border-2 border-lavo-ink rounded-md p-3 mb-4">
              <strong>Atenção:</strong> use o mesmo e-mail que você informou no formulário de
              inscrição do bloco. Esse vai ser seu e-mail de login pra sempre.
            </p>
          )}

          <form onSubmit={handleEmail} className="space-y-4">
            <div>
              <label className="block font-display text-[11px] tracking-wider text-lavo-ink mb-2">
                E-MAIL
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3 py-3 rounded-md border-2 border-lavo-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lavo-blue"
              />
            </div>
            <div>
              <label className="block font-display text-[11px] tracking-wider text-lavo-ink mb-2">
                SENHA
              </label>
              <input
                type="password"
                placeholder={mode === 'signin' ? '4 últimos dígitos do WhatsApp' : 'mín. 6 caracteres'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === 'signin' ? undefined : 6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full px-3 py-3 rounded-md border-2 border-lavo-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lavo-blue"
              />
            </div>
            {error && <p className="text-sm font-semibold text-lavo-red">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-md border-[2.5px] border-lavo-ink bg-lavo-blue text-lavo-paper font-display text-sm tracking-wide shadow-hard disabled:opacity-50"
            >
              {busy ? '...' : mode === 'signin' ? 'ENTRAR' : 'CRIAR CONTA'}
            </button>
          </form>
        </div>

        <p className="relative text-center text-[13px] font-semibold text-lavo-ink mt-5 px-10 leading-relaxed">
          Acesso liberado pela diretoria do bloco.
          <br />
          Fale com a diretoria se ainda não tem conta.
        </p>
      </div>
    </div>
  )
}
