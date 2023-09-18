export interface User {
  id: string
  name: string
  email: string
  firebase_id: string
  fcm_token: string
}

export interface CreateUser {
  name: string
  email: string
  firebase_id: string
}
