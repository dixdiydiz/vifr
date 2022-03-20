// @ts-ignore
import Routes from '@vifr-virtual-conventional-routes'

// @ts-ignore
const pages = import.meta.glob('./pages/*.jsx')

export function ConventionalRoutes() {
  return (
    <>
      <Routes />
    </>
  )
}