import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { createAndTrainModel, initialize, runTest } from '~/models/car_mpg'
import { tfvis } from '~/services/tfvis'

export const loader = async () => {
  const isModelLoaded = await initialize()
  return json({ isModelLoaded })
}

export default function MpgModelPage() {
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
    <div className="text-center">
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
