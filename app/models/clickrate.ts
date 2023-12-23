import * as tf from '@tensorflow/tfjs'

interface TestData {
  age: number
  prefecture: string
  click: boolean
}

const ALL_PREFECTURES = ['東京都', '大阪府', '兵庫県']

const TEST_DATA = [
  {
    age: 30,
    prefecture: '東京都',
    click: false,
  },
  {
    age: 40,
    prefecture: '大阪府',
    click: true,
  },
  {
    age: 55,
    prefecture: '兵庫県',
    click: true,
  },
] satisfies TestData[]

const loadData = () => {
  return TEST_DATA.filter((d) => {
    return d.age >= 0 && d.age <= 150 && ALL_PREFECTURES.includes(d.prefecture)
  })
}

const convertToTensor = (data: TestData[]) => {
  return tf.tidy(() => {
    const ageInputs = data.map((d) => d.age)
    const prefectureInputs = data.map((d) =>
      ALL_PREFECTURES.findIndex((pref) => pref === d.prefecture),
    )
    const labels = data.map((d) => Number(d.click))

    const inputTensor = {
      age: tf.tensor2d(ageInputs, [ageInputs.length, 1]),
      prefecture: tf.tensor2d(prefectureInputs, [prefectureInputs.length, 1]),
    }
    const labelTensor = tf.tensor2d(labels, [labels.length, 1])
    const lines = {
      age: {
        min: inputTensor.age.min(),
        max: inputTensor.prefecture.min(),
      },
      prefecture: {
        min: inputTensor.prefecture.min(),
        max: inputTensor.prefecture.max(),
      },
      label: {
        min: labelTensor.min(),
        max: labelTensor.max(),
      },
    }

    const normalized = {
      age: inputTensor.age
        .sub(lines.age.min)
        .div(lines.age.max.sub(lines.age.min)),
      prefecture: inputTensor.prefecture
        .sub(lines.prefecture.min)
        .div(lines.prefecture.max.sub(lines.prefecture.min)),
      label: labelTensor
        .sub(lines.label.min)
        .div(lines.label.max.sub(lines.label.min)),
    }

    return { data: normalized, lines }
  })
}

const run = () => {
  const rawData = loadData()
  const { data, lines } = convertToTensor(rawData)
}

run()
