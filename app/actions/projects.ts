"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const files = formData.getAll("images") as File[]

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

  const imageUrls: string[] = []
  const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB

  for (const file of files) {
    if (!file || file.size === 0 || !file.name) continue

    if (file.size > MAX_FILE_SIZE) {
      console.error(`O ficheiro ${file.name} excede o limite máximo de 3MB.`)
      continue
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(fileName)
      imageUrls.push(publicUrl)
    } else {
      console.error("Erro no upload da imagem:", uploadError.message)
    }
  }

  const { error } = await supabase.from("projects").insert({
    title: title.trim(),
    description: description.trim(),
    images: imageUrls,
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
