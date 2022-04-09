import { DataProvider } from './fakeData'
import { useState, useTransition, Suspense, lazy, useId } from 'react'
const Comments = lazy(() => import('./Comments'))

export default function () {
  const [count, setCount] = useState(0)
  const [isPending, startTransition] = useTransition()
  const id = useId()
  return (
    <>
      <h1>selectivehydration</h1>
      <p>{id}</p>
      <p>You clicked {count} times</p>
      {/*<button onClick={() => startTransition(() => setCount((c) => c + 1))}>*/}
      <button onClick={() => setCount((c) => c + 1)}>click me</button>
      <Suspense fallback={<div>laoding1...</div>}>
        <Comments />
      </Suspense>
    </>
  )
}
