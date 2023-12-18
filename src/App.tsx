import { run } from './services/train'
import React from 'react'

export const App = () => {
	React.useEffect(() => {
		run()
	}, [])

	return (
		<div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-screen">
			<header className="px-2 py-1 shadow">
				<h1 className="text-lg">
					<span className="font-bold">Tensorflow.js</span>{' '}
					<span className="text-slate-500">Practice</span>
				</h1>
			</header>

			<main className="bg-slate-200" />

			<footer className="px-2 py-1 text-center shadow">
				copyright &copy; coji
			</footer>
		</div>
	)
}
