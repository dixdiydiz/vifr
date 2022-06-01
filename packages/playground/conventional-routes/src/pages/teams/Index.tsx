import { Outlet } from 'react-router-dom'

export default function Index(): JSX.Element {
  return (
    <>
      <div className="pages/index">pages/index</div>
      <Outlet />
    </>
  )
}
