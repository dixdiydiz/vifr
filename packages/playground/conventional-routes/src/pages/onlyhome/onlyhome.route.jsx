import { Outlet } from 'react-router-dom'
import {useState} from "react";

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>only home page</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(c => c+1)}>click me</button>
      <Outlet />
    </>
  )
}
