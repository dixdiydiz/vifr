import { Outlet } from 'react-router-dom'
export default function Home() {
  return (
    <>
      <h1>only home page</h1>
      <Outlet />
    </>
  )
}
