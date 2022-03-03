import {renderToPipeableStream} from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"
import { App } from './App'

export function render(url, res) {
  let didError = false
  const {pipe, abort} = renderToPipeableStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
    {
      bootstrapScripts: ['src/entry-client.jsx'],
      onCompleteShell() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        pipe(res);
      },
      onError(x) {
        didError = true;
        console.error(x);
      }
    }
  )
}