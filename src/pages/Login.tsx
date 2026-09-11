import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { friendlyAuthError } from '../lib/errors'

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
  const { session, signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = safeNext(searchParams.get('next'))

  const [mode, setMode] = useState<'signin' | 'changepw'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // entrar
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // trocar senha
  const [cpEmail, setCpEmail] = useState('')
  const [cpCurrent, setCpCurrent] = useState('')
  const [cpNew, setCpNew] = useState('')
  const [cpConfirm, setCpConfirm] = useState('')
  const [suppressRedirect, setSuppressRedirect] = useState(false)

  if (session && !suppressRedirect) return <Navigate to={next} replace />

  function switchMode(next: 'signin' | 'changepw') {
    setMode(next)
    setError(null)
  }

  async function handleSignin(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const { error: err } = await signInWithEmail(email, password)
    setBusy(false)
    if (err) setError(friendlyAuthError(err))
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (cpNew.length < 6) {
      setError('A senha nova precisa ter pelo menos 6 caracteres.')
      return
    }
    if (cpNew !== cpConfirm) {
      setError('As senhas novas não são iguais.')
      return
    }
    setBusy(true)
    setSuppressRedirect(true)

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: cpEmail,
      password: cpCurrent,
    })
    if (signInErr) {
      setBusy(false)
      setSuppressRedirect(false)
      setError(friendlyAuthError(signInErr.message))
      return
    }

    const { error: updateErr } = await supabase.auth.updateUser({ password: cpNew })
    setBusy(false)
    if (updateErr) {
      setError(friendlyAuthError(updateErr.message))
      return
    }
    await supabase.rpc('mark_password_changed')
    navigate(next, { replace: true })
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

        {/* aviso sobre a senha padrão, sempre visível */}
        <div className="w-full max-w-sm mt-6 bg-lavo-ink border-2 border-lavo-ink rounded-md p-3.5">
          <p className="text-xs text-lavo-paper text-center leading-relaxed">
            Sua conta já existe! Faça login com seu <strong className="text-lavo-cyan">e-mail</strong>{' '}
            e os <strong className="text-lavo-cyan">6 últimos dígitos do seu celular</strong> como
            senha.
          </p>
        </div>

        <div className="w-full max-w-sm mt-4 bg-lavo-paper border-[3px] border-lavo-ink rounded-lg shadow-hard-lg p-6">
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2 rounded-md border-2 border-lavo-ink font-display text-[11px] tracking-wider ${
                mode === 'signin' ? 'bg-lavo-ink text-lavo-cyan' : 'bg-white text-lavo-ink'
              }`}
            >
              ENTRAR
            </button>
            <button
              type="button"
              onClick={() => switchMode('changepw')}
              className={`flex-1 py-2 rounded-md border-2 border-lavo-ink font-display text-[11px] tracking-wider ${
                mode === 'changepw' ? 'bg-lavo-ink text-lavo-cyan' : 'bg-white text-lavo-ink'
              }`}
            >
              TROCAR SENHA
            </button>
          </div>

          {mode === 'signin' ? (
            <form onSubmit={handleSignin} className="space-y-4">
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
                  placeholder="6 últimos dígitos do celular"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-3 rounded-md border-2 border-lavo-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lavo-blue"
                />
              </div>
              {error && <p className="text-sm font-semibold text-lavo-red">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 rounded-md border-[2.5px] border-lavo-ink bg-lavo-blue text-lavo-paper font-display text-sm tracking-wide shadow-hard disabled:opacity-50"
              >
                {busy ? '...' : 'ENTRAR'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <p className="text-xs text-lavo-ink bg-white border-2 border-lavo-ink rounded-md p-3">
                Informe seu e-mail, sua senha atual (os 6 últimos dígitos do celular, se ainda não
                trocou) e a senha nova.
              </p>
              <div>
                <label className="block font-display text-[11px] tracking-wider text-lavo-ink mb-2">
                  E-MAIL
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={cpEmail}
                  onChange={(e) => setCpEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-3 py-3 rounded-md border-2 border-lavo-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lavo-blue"
                />
              </div>
              <div>
                <label className="block font-display text-[11px] tracking-wider text-lavo-ink mb-2">
                  SENHA ATUAL
                </label>
                <input
                  type="password"
                  placeholder="6 últimos dígitos do celular"
                  value={cpCurrent}
                  onChange={(e) => setCpCurrent(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-3 rounded-md border-2 border-lavo-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lavo-blue"
                />
              </div>
              <div>
                <label className="block font-display text-[11px] tracking-wider text-lavo-ink mb-2">
                  SENHA NOVA
                </label>
                <input
                  type="password"
                  placeholder="mín. 6 caracteres"
                  value={cpNew}
                  onChange={(e) => setCpNew(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-3 rounded-md border-2 border-lavo-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lavo-blue"
                />
              </div>
              <div>
                <label className="block font-display text-[11px] tracking-wider text-lavo-ink mb-2">
                  CONFIRMAR SENHA NOVA
                </label>
                <input
                  type="password"
                  placeholder="mín. 6 caracteres"
                  value={cpConfirm}
                  onChange={(e) => setCpConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-3 rounded-md border-2 border-lavo-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lavo-blue"
                />
              </div>
              {error && <p className="text-sm font-semibold text-lavo-red">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 rounded-md border-[2.5px] border-lavo-ink bg-lavo-blue text-lavo-paper font-display text-sm tracking-wide shadow-hard disabled:opacity-50"
              >
                {busy ? '...' : 'TROCAR SENHA'}
              </button>
            </form>
          )}
        </div>

        <p className="relative text-center text-[13px] font-semibold text-lavo-ink mt-5 px-10 leading-relaxed">
          Acesso liberado pela diretoria do bloco.
          <br />
          Fale com a diretoria se ainda não conseguir entrar.
        </p>
      </div>
    </div>
  )
}
