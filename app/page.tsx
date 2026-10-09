import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createProject, deleteProject, signOut } from "@/app/actions/projects"
import { Orbit, LogOut, Plus, Trash2, Rocket, Radio, Sparkles, Image as ImageIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { Suspense } from "react"

type Project = {
  id: string
  title: string
  description: string
  images?: string[]
  created_at: string
}

async function AdminContent() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, description, images, created_at")
    .order("created_at", { ascending: false })

  const list = (projects as Project[] | null) ?? []

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header do Centro de Comando */}
      <header className="border-b border-cyan-500/15 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <Orbit className="h-5 w-5 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                Centro de Comando Espacial
              </h1>
              <p className="text-[11px] text-cyan-400/80 tracking-widest uppercase font-mono">
                Project Space Admin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sessão Ativa
            </span>
            <form
              action={async () => {
                "use server"
                await signOut()
                redirect("/login")
              }}
            >
              <Button type="submit" variant="ghost" size="sm" className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30">
                <LogOut className="h-4 w-4 mr-2" />
                Desconectar
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-12 flex-1 w-full">
        {/* Painel de Lançamento de Novo Projeto */}
        <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-cyan-500/25 shadow-[0_0_30px_rgba(56,189,248,0.08)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-cyan-500/10 via-purple-500/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
          <CardHeader className="relative z-10 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 w-fit mb-2">
              <Rocket className="h-3.5 w-3.5" />
              Lançar Missão
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Registrar Novo Projeto
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configure as diretrizes e telemetria do projeto para publicação no catálogo público.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <form action={createProject} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300 text-sm font-medium">Nome da Missão / Projeto</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="ex: Telescópio Orbital James Web v2"
                  required
                  className="bg-slate-950/70 border-cyan-500/20 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-600 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300 text-sm font-medium">Sumário / Descrição Técnica</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva os objetivos, especificações e conquistas desta iniciativa..."
                  rows={4}
                  required
                  className="bg-slate-950/70 border-cyan-500/20 focus:border-cyan-400 focus:ring-cyan-400/20 text-white placeholder:text-slate-600 rounded-lg resize-none"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="images" className="text-slate-300 text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-cyan-400" />
                    Fotografias / Imagens Espaciais (Opcional)
                  </Label>
                  <span className="text-[11px] font-mono text-cyan-400/70">Máx: 3MB por ficheiro • Múltiplos permitidos</span>
                </div>
                <Input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  multiple
                  className="bg-slate-950/70 border-cyan-500/20 focus:border-cyan-400 focus:ring-cyan-400/20 text-slate-300 file:bg-cyan-950 file:border-0 file:text-cyan-300 file:text-xs file:font-mono file:px-3 file:py-1 file:rounded-md file:mr-3 hover:file:bg-cyan-900 cursor-pointer rounded-lg"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold px-6 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                <Plus className="h-4 w-4 mr-2" />
                Publicar no Radar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Projetos Publicados */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Radio className="h-5 w-5 text-cyan-400" />
                Projetos Transmitidos ({list.length})
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Projetos ativos com sinal visível no catálogo cósmico.
              </p>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-cyan-500/20 bg-slate-950/40 backdrop-blur-md py-20 text-center px-6">
              <p className="text-slate-400 font-medium">
                Nenhum projeto em transmissão. Utilize o painel acima para registrar a primeira missão.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {list.map((project) => (
                <Card 
                  key={project.id} 
                  className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-200"
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                        <CardTitle className="text-lg font-semibold text-white">
                          {project.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs font-mono text-cyan-400/70">
                        Lançamento: {new Date(project.created_at).toLocaleDateString("pt-PT", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <form
                      action={async () => {
                        "use server"
                        await deleteProject(project.id)
                      }}
                    >
                      <Button 
                        type="submit" 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30"
                        title="Encerrar Missão"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                    {project.images && project.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        {project.images.map((imgUrl, idx) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-cyan-500/20 bg-slate-950/60 group/img">
                            <img
                              src={imgUrl}
                              alt={`${project.title} - imagem ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background p-6">A carregar...</div>}>
      <AdminContent />
    </Suspense>
  )
}
