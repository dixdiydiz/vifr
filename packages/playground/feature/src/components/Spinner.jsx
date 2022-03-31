import { useResolvedPath } from 'react-router-dom'
export default function Spinner() {
  const path = useResolvedPath()
  return <div className="spinner">{path}</div>
}
