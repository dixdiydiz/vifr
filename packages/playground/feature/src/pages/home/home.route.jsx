import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import HomeContent from './HomeContent'
export default function Home() {
  return (
    <>
      <h1>Home page</h1>
      {/*<Suspense fallback={<div>laoding....</div>}>*/}
      {/*  <Outlet />*/}
      {/*</Suspense>*/}
      <HomeContent />
    </>
  )
}
