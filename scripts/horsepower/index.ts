import * as tf from '@tensorflow/tfjs-node'
import fs from 'fs/promises'
import { createDatabase, sql } from '~/services/duckdb.server'

interface CarData {
  id: number
  name: string
  milesPerGallon: number
  horsepower: number
}

interface Database {
  carsData: {
    id: number
    name: string
    milesPerGallon: number
    horsepower: number
  }
}

export const loadData = async () => {
  const db = createDatabase<Database>()

  await sql<Omit<CarData, 'id'>>`
CREATE OR REPLACE TABLE carsData AS
SELECT
  Name AS name,
  "Miles_per_Gallon" AS "milesPerGallon",
  "Horsepower" AS "horsepower"
FROM
read_json(
  'https://storage.googleapis.com/tfjs-tutorials/carsData.json',
  format='array',
  columns={
    Name: 'VARCHAR',
    Miles_per_Gallon: 'FLOAT',
    Cylinders: 'FLOAT',
    Displacement: 'FLOAT',
    Horsepower: 'FLOAT',
    Weight_in_lbs: 'FLOAT',
    Acceleration: 'FLOAT',
    Year: 'VARCHAR',
    Origin: 'VARCHAR'
  }
)
WHERE
  milesPerGallon IS NOT NULL AND
  horsepower IS NOT NULL
`.execute(db)

  const { horsepowerMax, horsepowerMin, milesPerGallonMax, milesPerGallonMin } =
    await db
      .selectFrom('carsData')
      .select([
        ({ fn }) => fn.max('horsepower').as('horsepowerMax'),
        ({ fn }) => fn.min('horsepower').as('horsepowerMin'),
        ({ fn }) => fn.max('carsData.milesPerGallon').as('milesPerGallonMax'),
        ({ fn }) => fn.min('carsData.milesPerGallon').as('milesPerGallonMin'),
      ])
      .executeTakeFirstOrThrow()

  const result = await sql<CarData>`
SELECT
  CAST(row_number() OVER () AS INT) AS id,
  name,
  (horsepower - ${horsepowerMin}) / (${horsepowerMax} - ${horsepowerMin}) AS horsepower,
  (milesPerGallon - ${milesPerGallonMin}) / (${milesPerGallonMax} - ${milesPerGallonMin}) AS milesPerGallon
FROM
  carsData
`.execute(db)

  await db.destroy()

  return {
    coefficients: {
      horsepower: horsepowerMax - horsepowerMin,
      milesPerGallon: milesPerGallonMax - milesPerGallonMin,
    },
    data: result.rows,
  }
}

/**
 * モデルの作成
 * @returns
 */
export const createModel = () => {
  // Create a sequential model
  const model = tf.sequential()

  // Add a single input layer
  model.add(tf.layers.dense({ inputShape: [1], units: 1 }))

  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }))

  // Add an output layer
  model.add(tf.layers.dense({ units: 1 }))

  return model
}

export const trainModel = async (model: tf.LayersModel, data: CarData[]) => {
  // Prepare the model for training.
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  })

  const inputs = data.map((d) => d.horsepower)
  const labels = data.map((d) => d.milesPerGallon)

  const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
  const labelTensor = tf.tensor2d(labels, [labels.length, 1])

  const batchSize = 32
  const epochs = 10

  const history = await model.fit(inputTensor, labelTensor, {
    batchSize,
    epochs,
    shuffle: true,
  })

  inputTensor.dispose()
  labelTensor.dispose()

  return history
}

export const saveModel = async (model: tf.LayersModel, path: string) => {
  await model.save(path)
  // await model.save(
  //   tf.io.withSaveHandler(async (artifacts) => {
  //     const modelTopology = artifacts.modelTopology
  //     const weightSpecs = artifacts.weightSpecs
  //     const weightData = artifacts.weightData

  //     await fs.writeFile(
  //       path,
  //       JSON.stringify(
  //         {
  //           modelTopology,
  //           weightSpecs,
  //           weightData,
  //         },
  //         null,
  //         2,
  //       ),
  //     )

  //     return {
  //       modelArtifactsInfo: {
  //         dateSaved: new Date(),
  //         modelTopology,
  //         weightSpecs,
  //         weightData,
  //         modelTopologyType: 'JSON',
  //         hoge: 'hoge',
  //       },
  //     }
  //   }),
  // )
}

export const loadModel = (path: string) => {
  return tf.loadLayersModel(path)
}

export const predict = async (model: tf.LayersModel, horsepower: number) => {
  const result = (await model.predict(
    tf.tensor2d([horsepower], [1, 1]),
  )) as tf.Tensor<tf.Rank>

  const ret = await result.data()
  result.dispose()

  return ret[0]
}
