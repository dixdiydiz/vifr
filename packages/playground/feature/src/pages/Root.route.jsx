import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <div>
        <h4>Root Component</h4>
        <Outlet />
      </div>
    </>
  )
}
