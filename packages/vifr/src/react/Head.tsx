

// copy from vite
const CLIENT_PUBLIC_PATH = `/@vite/client`

export function Head() {
  return (
    <>
      <script type="module" src={CLIENT_PUBLIC_PATH} />
    </>
  )
}