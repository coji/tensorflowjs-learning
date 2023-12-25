import * as tf from '@tensorflow/tfjs'
import { tfvis } from '~/services/tfvis'

export const run = async (testValue: number) => {
  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }))
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

  // y = 2x - 1
  const data = [
    { x: -1, y: -3 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 7 },
  ]
  const xs = tf.tensor2d(
    data.map((d) => d.x),
    [6, 1],
  )
  const ys = tf.tensor2d(
    data.map((d) => d.y),
    [6, 1],
  )

  await model.fit(xs, ys, {
    epochs: 250,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'meanSquaredError'],
      { height: 200, callbacks: ['onEpochEnd'] },
    ),
  })

  const predict = model.predict(tf.tensor2d([testValue], [1, 1]))
  let ret = null
  if (Array.isArray(predict)) {
    ret = await predict[0].dataSync()[0]
  } else {
    ret = await predict.dataSync()[0]
  }

  tfvis.render.scatterplot(
    { name: 'Model Predictions vs Original Data' },
    {
      values: [data, [{ x: testValue, y: ret }]],
      series: ['x', 'y'],
    },
    {
      xLabel: 'X',
      yLabel: 'Y',
      height: 300,
    },
  )

  return ret
}
