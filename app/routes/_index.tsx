import {
	initialize,
	createAndTrainModel,
	runTest,
	modelStatus,
} from '~/models/car/mpg'
import { tfvis } from '~/services/tfvis'
import { Button } from '~/components/ui/button'
import React from 'react'
import { json } from '@vercel/remix'
import { useLoaderData } from '@remix-run/react'

export const loader = async () => {
	const isModelLoaded = await initialize()
	return json({ isModelLoaded })
}

export default function IndexPage() {
	const { isModelLoaded } = useLoaderData() as { isModelLoaded: boolean }
	const [isPrepared, setIsPrepared] = React.useState(isModelLoaded)

	const handleClickRun = async () => {
		tfvis.visor().open()
		await runTest()
	}

	const handleClickCreateAndTrain = async () => {
		tfvis.visor().open()
		await createAndTrainModel()
		setIsPrepared(true)
	}

	return (
		<div>
			<div>{JSON.stringify(modelStatus())}</div>

			{isPrepared ? (
				<Button type="button" onClick={() => handleClickRun()}>
					Run
				</Button>
			) : (
				<Button type="button" onClick={() => handleClickCreateAndTrain()}>
					Create and train model
				</Button>
			)}
		</div>
	)
}
