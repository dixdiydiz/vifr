import { Outlet } from 'react-router-dom'
import { useState } from 'react'

export default function Root(): JSX.Element {
  return (
    <>
      <div className="pages/root">pages/root</div>
      <Outlet />
    </>
  )
}
