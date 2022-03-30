import { Outlet } from 'react-router-dom'
export default function Home() {
  return (
    <>
      <h1>Home page</h1>
      <Outlet />
    </>
  )
}
