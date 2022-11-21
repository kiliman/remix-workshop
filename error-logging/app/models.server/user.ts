import usersJson from '~/data/users.json'
declare global {
  var __users__: User[]
}

let users: User[]

if (!global.__users__) {
  global.__users__ = usersJson
}
users = global.__users__

export type User = {
  id: number
  name: string
  email: string
  age: number
}

export function getUsers() {
  return users as User[]
}

export function getUser(userId: number) {
  return users.find(user => user.id === userId) as User | null
}

export function saveUser(
  userId: number,
  { name, email, age }: Omit<User, 'id'>,
) {
  const user = users.find(user => user.id === userId) as User | null
  if (!user) {
    return null
  }
  user.name = name
  user.email = email
  user.age = age
  return user
}
