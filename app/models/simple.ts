import * as tf from '@tensorflow/tfjs'
import { tfvis } from '~/services/tfvis'

export const run = async (testValue: number) => {
  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }))
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

  const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1])
  const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1])
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
  return ret
}
