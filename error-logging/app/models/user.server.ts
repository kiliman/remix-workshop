export type User = {
  id: number
  name: string
  email: string
  age: number
  birthday: Date
}

export async function getUser(userId: number) {
  return {
    id: userId,
    name: 'Kiliman',
    email: 'kiliman@gmail.com',
    age: 52,
    birthday: new Date(Date.parse('1970-03-09')),
  } as User
}
