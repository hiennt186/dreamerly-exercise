export interface User {
  id: string
  name: string
  email: string
  firebase_id: string
}

export interface CreateUser {
  name: string
  email: string
  firebase_id: string
}
