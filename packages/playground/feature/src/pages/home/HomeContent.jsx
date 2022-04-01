import { useParams } from 'react-router-dom'
export default function HomeContent() {
  const { homeId } = useParams()
  return (
    <>
      <h1>Home id page</h1>
      <div>{homeId}</div>
    </>
  )
}
