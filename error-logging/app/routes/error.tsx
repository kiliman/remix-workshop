export const loader = async () => {
  throw new Error(`Oops! at ${new Date().toISOString()}`)
}

export default function () {
  return <div>Oops!</div>
}
