import { DataProvider } from './fakeData'
import Comments from './Comments'

function createServerData() {
  let done = false
  let promise = null
  return {
    read() {
      if (done) {
        done = false
        return
      }
      if (promise) {
        throw promise
      }
      promise = new Promise((resolve) => {
        setTimeout(() => {
          done = true
          promise = null
          resolve()
        }, 5000)
      })
      throw promise
    }
  }
}

const data = createServerData()

export default function () {
  return (
    <>
      <h1>Comments</h1>
      <DataProvider data={data}>
        <Comments />
      </DataProvider>
      ,
    </>
  )
}
