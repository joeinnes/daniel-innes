import type { RequestEvent } from "@sveltejs/kit"

enum Role {
  Public = 'public',
  Friends = 'friends',
  Family = 'family',
  Admin = 'admin'
}

interface Query {
  visibility?: Role
}

interface User {
  name: string,
  email: string,
  id: number,
  role: Role
  iat: number
  exp: number
}

interface CustomRequestEvent extends RequestEvent {
  locals: {
    user: User | null
  },
  url?: URL
}