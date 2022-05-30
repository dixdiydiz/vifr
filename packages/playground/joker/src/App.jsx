// import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { PageRoutes } from 'vifr/react'
import { useState } from 'react'
import Spinner from './components/Spinner'

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <h3 id="app-h3">App Component</h3>
      <ul>
        <li>
          <Link to="/otherhome" reloadDocument>
            other home
          </Link>
        </li>
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
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((c) => c + 1)}>click me</button>
      <PageRoutes fallback={<Spinner />} />
    </>
  )
}
