import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import Resend from "next-auth/providers/resend"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "noreply@mobcat.ca"
    })
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error'
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Get the user's default workspace
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          include: {
            workspaces: {
              include: {
                workspace: true
              }
            }
          }
        })
        
        if (dbUser) {
          // If user has no workspaces, create a default one
          if (dbUser.workspaces.length === 0) {
            const workspace = await db.workspace.create({
              data: {
                name: `${dbUser.name || dbUser.email}'s Garden`,
                createdById: dbUser.id,
                members: {
                  create: {
                    userId: dbUser.id,
                    role: 'owner'
                  }
                },
                gardens: {
                  create: {
                    name: 'Main Garden',
                    rows: 4,
                    columnsPerRow: 6
                  }
                }
              }
            })
            
            await db.user.update({
              where: { id: dbUser.id },
              data: { defaultWorkspaceId: workspace.id }
            })
            
            session.user.defaultWorkspaceId = workspace.id
          } else {
            session.user.defaultWorkspaceId = dbUser.defaultWorkspaceId || dbUser.workspaces[0].workspaceId
          }
        }
      }
      return session
    }
  }
})