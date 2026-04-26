import { Elysia } from 'elysia'

export const dynamic = 'force-dynamic'

export const app = new Elysia({ prefix: '/api' }).get(
  '/hello',
  () => 'hello world'
)

export const GET = app.fetch
export const POST = app.fetch
