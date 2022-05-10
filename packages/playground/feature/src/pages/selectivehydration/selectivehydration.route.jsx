import { useState, Suspense, lazy, useId, useMemo } from 'react'
import * as React from 'react'
import { CovertSuspense } from 'vifr/react'
const Comments = lazy(() => import('./Comments'))

const DynamicComment = React.memo(
  ({ children, count }) => {
    return (
      <>
        <Suspense fallback={<div>loading22</div>}>{children}</Suspense>
      </>
    )
  },
  (prev, curr) => {
    console.log(prev, curr)
    return true
  }
)

function DynamicComment2({ count, children }) {
  const [count2, setCount2] = useState(0)
  const cloneElement = React.cloneElement(children)
  return (
    <>
      <p>You clicked {count2} times in DynamicComment2</p>
      <button onClick={() => setCount2((c) => c + 1)}>click me</button>
      {count >= 6 ? (
        <Suspense fallback={<div>loading22</div>}>{children}</Suspense>
      ) : (
        <DynamicComment count={count}>{cloneElement}</DynamicComment>
      )}
    </>
  )
}

function DynamicComment3({ children }) {
  const memoChildren = useMemo(() => {
    return children
  }, [])
  return (
    <>
      <p>You clicked {count2} times in DynamicComment2</p>
      <button onClick={() => setCount2((c) => c + 1)}>click me</button>
      <Suspense fallback={<div>loading22</div>}>{memoChildren}</Suspense>
    </>
  )
}

export default function () {
  const [count, setCount] = useState(0)
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
      <CovertSuspense count={count} fallback={<div>loading cover</div>}>
        <Comments count={count} />
      </CovertSuspense>
    </>
  )
}
