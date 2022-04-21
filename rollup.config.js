import vifrRoll from './packages/vifr/rollup.config'
import vifrReactRoll from './packages/vifr-react/rollup.config'

export default (commandLineArgs) => {
  return [...vifrRoll(commandLineArgs), ...vifrReactRoll(commandLineArgs)]
}
