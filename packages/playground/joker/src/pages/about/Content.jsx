import { useParams } from 'react-router-dom'
export default function Content() {
  const { homeId } = useParams()
  return (
    <>
      <h1>Content</h1>
      <div>{homeId}</div>
    </>
  )
}
