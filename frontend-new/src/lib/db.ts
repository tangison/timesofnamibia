import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createFallbackDb() {
  const modelProxy = new Proxy(
    {},
    {
      get(_, method: string) {
        if (method === 'findMany') return async () => []
        if (method === 'findFirst' || method === 'findUnique') return async () => null
        if (method === 'count') return async () => 0
        if (method === 'upsert' || method === 'create' || method === 'update') return async () => null
        return async () => null
      },
    }
  )

  return new Proxy(
    {},
    {
      get() {
        return modelProxy
      },
    }
  )
}

let prisma: PrismaClient | undefined

try {
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: ['query'],
    })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (error) {
  console.warn('[db] Prisma client unavailable, using fallback DB adapter.', error)
}

export const db = (prisma ?? createFallbackDb()) as PrismaClient
