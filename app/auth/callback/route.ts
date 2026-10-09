import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https"
  const baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin

  if (code) {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

    const response = NextResponse.redirect(`${baseUrl}${next}`)

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response
    }
    console.error("Supabase auth exchangeCodeForSession error:", error)
    const errMessage = encodeURIComponent(error.message || "auth_exchange_failed")
    return NextResponse.redirect(`${baseUrl}/login?error=${errMessage}`)
  }

  const errorParam = searchParams.get("error_description") || searchParams.get("error") || "no_code"
  return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(errorParam)}`)
}
