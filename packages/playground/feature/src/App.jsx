import { Link, Routes, Route } from 'react-router-dom'
import { ConventionalRoutes } from 'vifr/react'

export default function App() {
  return (
    <>
      <h3>App Component</h3>
      <ul>
        <li>
          <Link to="/home" reloadDocument>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" reloadDocument>
            About
          </Link>
        </li>
      </ul>
      <a href="/home">Home aaa1</a>
      <ConventionalRoutes />
    </>
  )
}
