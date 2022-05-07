import { useData } from './fakeData'
import { useCovertData } from 'vifr/react'

export default function Comments({ count }) {
  const comments = useCovertData(async () => {
    const fakeData = [
      "Wait, it doesn't wait for React to load?",
      'How does this even work?',
      'I like marshmallows'
    ]
    setTimeout(() => {
      return fakeData
    }, 3000)
  })
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
