import { run } from '@/models/car/train'
import { tfvis } from '@/services/tfvis'
import { Button } from '@/components/ui/button'
import { VisorToggleButton } from './components/VisorToggleButton'

export const App = () => {
	const handleClickRun = () => {
		tfvis.visor().open()
		run()
	}

	return (
		<div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-screen">
			<header className="px-2 py-1 shadow flex items-center">
				<h1 className="text-lg flex-1">
					<span className="font-bold">Tensorflow.js</span>{' '}
					<span className="text-slate-500">Practice</span>
				</h1>

				<VisorToggleButton />
			</header>

			<main className="container bg-slate-200 flex justify-center items-center h-full">
				<Button type="button" onClick={() => handleClickRun()}>
					Run
				</Button>
			</main>

			<footer className="px-2 py-2 text-center shadow">
				Copyright &copy; coji
			</footer>
		</div>
	)
}
