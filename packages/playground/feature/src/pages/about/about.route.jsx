import { addAndMultiply } from '../../add'
import { multiplyAndAdd } from '../../multiply'

export default function About() {
  return (
    <>
      <h1>Abou1t</h1>
      <div>{addAndMultiply(1, 2, 3)}</div>
      <div>{multiplyAndAdd(1, 2, 3)}</div>
    </>
  )
}
