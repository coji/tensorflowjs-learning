import { Link, Outlet } from '@remix-run/react'
import { VisorToggleButton } from '~/components/VisorToggleButton'

export default function AppLayout() {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-screen">
      <header className="px-2 py-1 shadow flex items-center">
        <h1 className="text-lg flex-1">
          <Link to="/">
            <span className="font-bold">Tensorflow.js</span>{' '}
            <span className="text-slate-500">Practice</span>
          </Link>
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
  )
}
