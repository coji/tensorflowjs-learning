import { loadModel, predict } from './horsepower'

const main = async () => {
  const model = await loadModel('file://./models/horsepower.model/model.json')
  model.summary()

  const ret = await predict(model, 0.2)
  console.log({ ret })
}

await main()
