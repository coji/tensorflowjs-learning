import { run } from '@/services/train'
import { tfvis } from '@/services/tfvis'
import { Button } from '@/components/ui/button'

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

				<Button variant="destructive" onClick={handleClickToggleVisor}>
					toggle
				</Button>
			</header>

			<main className="container bg-slate-200">
				<Button type="button" onClick={() => handleClickRun()}>
					Run
				</Button>
			</main>

			<footer className="px-2 py-1 text-center shadow">
				copyright &copy; coji
			</footer>
		</div>
	)
}
