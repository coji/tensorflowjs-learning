import { loadData } from './horsepower'

const buildAndSaveModel = () => {}

const train = async () => {
  const data = await loadData()
  console.log(data)
  buildAndSaveModel()
}

await train()
