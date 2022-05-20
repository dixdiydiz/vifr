import { useState, Suspense, lazy, useId, useMemo } from 'react'
import * as React from 'react'
import MemoSuspense from '../../components/MemoSuspense'
const Comments = lazy(() => import('./Comments'))

export default function () {
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(0)
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
      <p>You clicked {count2} times</p>
      <button onClick={() => setCount2((c) => c + 1)}>自身渲染</button>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((c) => c + 1)}>
        点击触发comment渲染
      </button>
      <MemoSuspense
        fallback={<div>loading22</div>}
        style={{ display: 'block' }}
        className="covert"
      >
        <Comments count={count} />
      </MemoSuspense>
    </>
  )
}
