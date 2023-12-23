import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { VisorToggleButton } from '~/components/VisorToggleButton'
import '~/styles/globals.css'

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-screen">
          <header className="px-2 py-1 shadow flex items-center">
            <h1 className="text-lg flex-1">
              <span className="font-bold">Tensorflow.js</span>{' '}
              <span className="text-slate-500">Practice</span>
            </h1>

            <VisorToggleButton />
          </header>

          <main className="container bg-slate-200 flex justify-center items-center h-full">
            <Outlet />
          </main>

          <footer className="px-2 py-2 text-center shadow">
            <p>
              Copyright &copy;{' '}
              <a
                className="underline"
                target="_blank"
                rel="noreferrer"
                href="https://twitter.com/techtalkjp"
              >
                coji
              </a>
            </p>
            <p>
              <a
                className="underline"
                target="_blank"
                rel="noreferrer"
                href="https://github.com/coji/tensorflowjs-learning"
              >
                GitHub
              </a>
            </p>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
