import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import Content from './Content'
export default function () {
  return (
    <>
      <h1>Other Home page</h1>
      <Suspense fallback={<div>laoding....</div>}>
        <Outlet />
      </Suspense>
      <Content />
    </>
  )
}
