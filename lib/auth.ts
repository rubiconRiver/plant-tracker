import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }
  
  return session.user
}

export async function getSession() {
  return await auth()
}