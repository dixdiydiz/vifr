import { useData } from './fakeData'

export default function Comments() {
  const comments = useData()
  return (
    <>
      <h1>Comments</h1>
      {comments.map((comment, i) => (
        <p className="comment" key={i}>
          {comment}
        </p>
      ))}
    </>
  )
}
