import { run } from './services/train'
import { tfvis } from './services/tfvis'

export const App = () => {
	const handleClickRun = () => {
		tfvis.visor().open()
		run()
	}

	const handleClickToggleVisor = () => {
		tfvis.visor().toggle()
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-screen">
			<header className="px-2 py-1 shadow flex">
				<h1 className="text-lg flex-1">
					<span className="font-bold">Tensorflow.js</span>{' '}
					<span className="text-slate-500">Practice</span>
				</h1>

				<div>
					<button type="button" onClick={handleClickToggleVisor}>
						toggle
					</button>
				</div>
			</header>

			<main className="bg-slate-200">
				<button type="button" onClick={() => handleClickRun()}>
					Run
				</button>
			</main>

			<footer className="px-2 py-1 text-center shadow">
				copyright &copy; coji
			</footer>
		</div>
	)
}
