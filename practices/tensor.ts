import * as tf from '@tensorflow/tfjs'

// tensorflow.js のテンソルの使い方
// https://www.tensorflow.org/js/guide/tensors_operations?hl=ja

/**
 * 基本的なテンソルの作成
 */
const basic = () => {
  // rank: 1
  const t1 = tf.tensor([1, 2, 3], [3], 'bool')
  t1.unique().indices.print(true)

  // rank: 1
  const t2 = tf.tensor([1, 2, 3, 4, 5, 6], [6], 'float32')
  t2.print(true)

  // rank: 2
  const t3 = tf.tensor([
    [1, 2, 3],
    [4, 5, 6],
  ])
  t3.print(true)

  // rank: 3
  const t4 = tf.tensor([
    [
      [1, 2, 3],
      [4, 5, 6],
    ],
    [
      [4, 5, 6],
      [7, 8, 9],
    ],
    [
      [4, 5, 6],
      [7, 8, 9],
    ],
  ])
  t4.print(true)
}

/**
 * テンソルの形状変更
 */
const reshape = () => {
  const t1 = tf.tensor([1, 2, 3])
  t1.print(true)
  t1.reshape([3, 1]).print(true)

  const t2 = tf.tensor([
    [1, 2],
    [3, 4],
  ])
  t2.print(true)
  t2.reshape([4]).print(true)
}

/**
 * テンソルからの配列・データの取得
 */
const array_and_data = async () => {
  const t1 = tf.tensor([
    [1, 2],
    [3, 4],
  ])
  t1.print(true)

  const t1_array = await t1.array() // asis
  console.log({ t1_array })

  const t1_data = await t1.data() // flatted
  console.log({ t1_data })
}

const calc = () => {
  // square
  const t1 = tf.tensor([1, 2, 3])
  t1.print(true)
  t1.square().print(true)

  const t2 = tf.tensor([4, 5, 6])
  t2.print(true)

  t1.add(t2).print(true)
  t1.mul(t2).print(true)
}

export const run = () => {
  console.log(tf.memory())
  console.time('test')
  calc()

  // basic()
  // reshape()
  // await array_and_data()

  console.timeEnd('test')
  console.log(tf.memory())
}

run()
