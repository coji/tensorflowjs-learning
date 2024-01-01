import fs from 'fs/promises'
import { createModel, loadData, saveModel, trainModel } from './horsepower'

const train = async () => {
  const { coefficients, data } = await loadData()
  const model = createModel()
  await trainModel(model, data)
  await saveModel(model, 'file://./models/horsepower.model')
}

await train()
