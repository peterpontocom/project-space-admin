import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createProject, deleteProject, signOut } from "@/app/actions/projects"
import { FolderKanban, LogOut, Plus, Trash2 } from "lucide-react"
import { redirect } from "next/navigation"

type Project = {
  id: string
  title: string
  description: string
  created_at: string
}

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, description, created_at")
    .order("created_at", { ascending: false })

  const list = (projects as Project[] | null) ?? []

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-6 w-6" />
            <h1 className="text-xl font-semibold tracking-tight">Project Space Admin</h1>
          </div>
          <form
            action={async () => {
              "use server"
              await signOut()
              redirect("/login")
            }}
          >
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5" />
              Novo Projeto
            </CardTitle>
            <CardDescription>
              Adicione um título e uma descrição para o projeto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Nome do projeto"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva o projeto..."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit">Publicar Projeto</Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Projetos publicados ({list.length})
          </h2>

          {list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
              Ainda não existem projetos. Crie o primeiro acima.
            </div>
          ) : (
            <div className="grid gap-4">
              {list.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className={"text-base"}>{project.title}</CardTitle>
                      <CardDescription>
                        {new Date(project.created_at).toLocaleDateString("pt-PT", {
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
                      <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {project.description}
                    </p>
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
