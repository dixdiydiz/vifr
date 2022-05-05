import { useData } from './fakeData'

export default function Comments({ count }) {
  const comments = useData()
  return (
    <>
      <h1>Comments</h1>
      {comments.map((comment, i) => (
        <p className="comment" key={i}>
          {comment}
        </p>
      ))}
      <p>prop count: {count}</p>
    </>
  )
}
