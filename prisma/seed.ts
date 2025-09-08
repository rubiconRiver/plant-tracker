import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Create default user
  const defaultUser = await prisma.user.create({
    data: {
      id: 'default-user',
      email: 'garett@mobcat.ca',
      name: 'Garett',
      defaultWorkspaceId: 'default-workspace'
    }
  })
  
  console.log('Created default user:', defaultUser.email)
  
  // Create default workspace
  const defaultWorkspace = await prisma.workspace.create({
    data: {
      id: 'default-workspace',
      name: 'My Home Garden',
      createdById: 'default-user'
    }
  })
  
  console.log('Created default workspace:', defaultWorkspace.name)
  
  // Add user to workspace
  const membership = await prisma.workspaceMember.create({
    data: {
      workspaceId: 'default-workspace',
      userId: 'default-user',
      role: 'owner'
    }
  })
  
  console.log('Added user to workspace as:', membership.role)
  
  // Create a sample garden
  const sampleGarden = await prisma.garden.create({
    data: {
      name: 'Kitchen Window',
      rows: 3,
      columnsPerRow: 4,
      workspaceId: 'default-workspace'
    }
  })
  
  console.log('Created sample garden:', sampleGarden.name)
  
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })