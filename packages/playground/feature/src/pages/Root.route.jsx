import { Outlet, useLocation } from 'react-router-dom'

export default function Root() {
  const { pathname } = useLocation()
  return (
    <>
      {pathname === '/' ? (
        <div>
          <h4>Root Component</h4>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  )
}
