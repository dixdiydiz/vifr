import { useParams } from 'react-router-dom'
export default function () {
  const { id } = useParams()
  return (
    <>
      <h1>Other Home id page</h1>
      <div>{id}</div>
    </>
  )
}
