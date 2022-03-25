import { Link, Routes, Route } from 'react-router-dom'
import { ConventionalRoutes } from 'vifr/react'

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
// const pages = import.meta.globEager('./pages/*.jsx')

// const routes = Object.keys(pages).map((path) => {
//   const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1]
//   return {
//     name,
//     path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
//     component: pages[path].default
//   }
// })

export default function App() {
  return (
    <>
      <nav>
        <ul>
          <div>app</div>
          {/*{routes.map(({ name, path }) => {*/}
          {/*  return (*/}
          {/*    <li key={path}>*/}
          {/*      <Link to={path}>{name}</Link>*/}
          {/*    </li>*/}
          {/*  )*/}
          {/*})}*/}
        </ul>
      </nav>
      <div>22</div>
      <ConventionalRoutes />
    </>
  )
}
