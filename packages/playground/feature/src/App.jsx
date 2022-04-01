// import { Suspense } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { ConventionalRoutes } from 'vifr/react'
import Spinner from './components/Spinner'

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
        <li>
          <Link to="/onlyhome" reloadDocument>
            onlyhome
          </Link>
        </li>
      </ul>
      <ConventionalRoutes fallback={<Spinner />} />
    </>
  )
}
