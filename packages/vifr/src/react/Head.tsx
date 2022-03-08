import {CLIENT_PUBLIC_PATH} from '../constants'

export function Head() {
  return (
    <>
      <script type="module" src={CLIENT_PUBLIC_PATH} />
    </>
  )
}