import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      defaultWorkspaceId?: string
    } & DefaultSession["user"]
  }

  interface User {
    defaultWorkspaceId?: string
  }
}