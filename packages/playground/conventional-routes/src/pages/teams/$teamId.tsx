import { useParams } from 'react-router-dom'

export default function TeamId(): JSX.Element {
  const { teamId } = useParams()
  return (
    <>
      <div className="pages-teams-teamId">pages/teams/$teamId</div>
      <p className="teamId">{teamId}</p>
    </>
  )
}
