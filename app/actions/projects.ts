"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string

  if (!title?.trim() || !description?.trim()) {
    return
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const { error } = await supabase.from("projects").insert({
    title: title.trim(),
    description: description.trim(),
    created_by: user.id,
  })

  if (error) {
    console.error("Erro ao criar projeto:", error.message)
    return
  }

  revalidatePath("/")
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string

  if (!title?.trim() || !description?.trim()) {
    return
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const { error } = await supabase
    .from("projects")
    .update({
      title: title.trim(),
      description: description.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Erro ao atualizar projeto:", error.message)
    return
  }

  revalidatePath("/")
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("Erro ao apagar projeto:", error.message)
    return
  }

  revalidatePath("/")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
}
