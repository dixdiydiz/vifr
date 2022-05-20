import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Root() {
  const [count, setCount] = useState(0)
  const { pathname } = useLocation()
  return (
    <>
      {pathname === '/' ? (
        <div>
          <h4>Root Component</h4>
        </div>
      ) : (
        <>
          <p>You clicked {count} times</p>
          <button onClick={() => setCount((c) => c + 1)}>click me</button>
          <Outlet />
        </>
      )}
    </>
  )
}
