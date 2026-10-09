"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Orbit, Sparkles, ShieldCheck } from "lucide-react"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Card className="w-full max-w-md relative overflow-hidden bg-slate-900/70 backdrop-blur-2xl border border-cyan-500/25 shadow-[0_0_40px_rgba(56,189,248,0.12)]">
        <div className="absolute top-0 right-0 w-44 h-44 bg-radial from-cyan-500/15 via-purple-500/5 to-transparent rounded-full -mr-14 -mt-14 pointer-events-none" />
        <CardHeader className="text-center space-y-4 relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <Orbit className="h-7 w-7 animate-[spin_10s_linear_infinite]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 mb-2">
              <Sparkles className="h-3 w-3" />
              Portal de Comando
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              Project Space Admin
            </CardTitle>
            <CardDescription className="mt-2 text-slate-400 text-sm">
              Autentique-se via credenciais cósmicas para gerir o catálogo de missões.
            </CardDescription>
          </div>
          {error && (
            <div className="rounded-xl bg-rose-950/50 p-3.5 text-xs text-rose-300 border border-rose-500/30 text-left break-all font-mono">
              <strong>Falha de Telemetria:</strong> {error}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-slate-950 hover:bg-slate-900 text-white border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all h-12"
            size="lg"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Acessar com Google
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-cyan-400/60 pt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            Canal Criptografado de Nível Orbital
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">A carregar...</div>}>
      <LoginContent />
    </Suspense>
  )
}
