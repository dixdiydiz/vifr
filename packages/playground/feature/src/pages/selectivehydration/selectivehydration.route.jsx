import { useState, Suspense, lazy, useId } from 'react'
import * as React from 'react'
const Comments = lazy(() => import('./Comments'))

const LazyComments = React.memo(
  () => {
    return (
      <>
        <Suspense fallback={<div>laoding1...</div>}>
          <Comments />
        </Suspense>
      </>
    )
  },
  (prevProps, nextProps) => {
    return true
  }
)

export default function () {
  const [count, setCount] = useState(0)
  const [isPending, startTransition] = useTransition()
  const id1 = useId()
  const id2 = useId()
  const id3 = useId()
  console.log(id1, id2, id3)
  return (
    <>
      <h1>selectivehydration</h1>
      <p>{id1}</p>
      <p>
        {id2}/{id3}
      </p>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((c) => c + 1)}>click me</button>
      <LazyComments>
        <Comments />
      </LazyComments>
    </>
  )
}
