import { Link, Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <div>
        <h1>Links</h1>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
        <div>
          <Outlet />
        </div>
      </div>
    </>
  )
}
