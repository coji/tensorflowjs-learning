import * as tf from '@tensorflow/tfjs'
import { tfvis } from '~/services/tfvis'

interface CarData {
	mpg: number
	horsepower: number
}

let model: tf.LayersModel | null = null

/**
 * Get the car data reduced to just the variables we are interested
 * and cleaned of missing data.
 */
async function getData() {
	const carsDataResponse = await fetch(
		'https://storage.googleapis.com/tfjs-tutorials/carsData.json',
	)
	const carsData = await carsDataResponse.json()
	const cleaned: CarData[] = carsData
		.map((car: { Miles_per_Gallon: number; Horsepower: number }) => ({
			mpg: car.Miles_per_Gallon,
			horsepower: car.Horsepower,
		}))
		.filter((car: CarData) => car.mpg != null && car.horsepower != null)

	return cleaned
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
function convertToTensor(data: CarData[]) {
	// Wrapping these calculations in a tidy will dispose any
	// intermediate tensors.

	return tf.tidy(() => {
		// Step 1. Shuffle the data
		tf.util.shuffle(data)

		// Step 2. Convert data to Tensor
		const inputs = data.map((d) => d.horsepower)
		const labels = data.map((d) => d.mpg)

		const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
		const labelTensor = tf.tensor2d(labels, [labels.length, 1])

		//Step 3. Normalize the data to the range 0 - 1 using min-max scaling
		const inputMax = inputTensor.max()
		const inputMin = inputTensor.min()
		const labelMax = labelTensor.max()
		const labelMin = labelTensor.min()

		const normalizedInputs = inputTensor
			.sub(inputMin)
			.div(inputMax.sub(inputMin))
		const normalizedLabels = labelTensor
			.sub(labelMin)
			.div(labelMax.sub(labelMin))

		return {
			inputs: normalizedInputs,
			labels: normalizedLabels,
			// Return the min/max bounds so we can use them later.
			inputMax,
			inputMin,
			labelMax,
			labelMin,
		}
	})
}

/**
 * モデルの作成
 * @returns
 */
function createModel() {
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

async function trainModel(
	model: tf.LayersModel,
	inputs: tf.Tensor<tf.Rank>,
	labels: tf.Tensor<tf.Rank>,
) {
	// Prepare the model for training.
	model.compile({
		optimizer: tf.train.adam(),
		loss: tf.losses.meanSquaredError,
		metrics: ['mse'],
	})

	const batchSize = 32
	const epochs = 10

	return await model.fit(inputs, labels, {
		batchSize,
		epochs,
		shuffle: true,
		callbacks: tfvis.show.fitCallbacks(
			{ name: 'Training Performance' },
			['loss', 'mse'],
			{ height: 200, callbacks: ['onEpochEnd'] },
		),
	})
}

function testModel(
	model: tf.LayersModel,
	inputData: CarData[],
	normalizationData: ReturnType<typeof convertToTensor>,
) {
	const { inputMax, inputMin, labelMin, labelMax } = normalizationData

	// Generate predictions for a uniform range of numbers between 0 and 1;
	// We un-normalize the data by doing the inverse of the min-max scaling
	// that we did earlier.
	const [xs, preds] = tf.tidy(() => {
		const xs = tf.linspace(0, 1, 100)
		const preds = model.predict(xs.reshape([100, 1]))
		if (Array.isArray(preds)) throw new Error('preds is array')

		const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin)
		const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin)

		// Un-normalize the data
		return [unNormXs.dataSync(), unNormPreds.dataSync()]
	})

	const predictedPoints = Array.from(xs).map((val, i) => {
		return { x: val, y: preds[i] }
	})

	const originalPoints = inputData.map((d) => ({
		x: d.horsepower,
		y: d.mpg,
	}))

	tfvis.render.scatterplot(
		{ name: 'Model Predictions vs Original Data' },
		{
			values: [originalPoints, predictedPoints],
			series: ['original', 'predicted'],
		},
		{
			xLabel: 'Horsepower',
			yLabel: 'MPG',
			height: 300,
		},
	)

	return { originalPoints, predictedPoints }
}

export const isModelLoaded = () => !!model
export const modelStatus = () => {
	return model ? model.name : undefined
}

/**
 * 初期化
 * @returns モデルが読み込めたかどうか
 */
export const initialize = async () => {
	if (!model) {
		model = await tf
			.loadLayersModel('localstorage://my-model-1')
			.catch(() => null)
	}
	return !!model // モデルが読み込めたかどうか
}

/**
 * モデルの作成と訓練
 */
export const createAndTrainModel = async () => {
	if (model) {
		return true
	}

	// 訓練データ、テストデータの取得と準備
	const data = await getData()
	const values = data.map((d) => ({
		x: d.horsepower,
		y: d.mpg,
	}))
	tfvis.render.scatterplot(
		{ name: 'Horsepower v MPG' },
		{ values },
		{
			xLabel: 'Horsepower',
			yLabel: 'MPG',
			height: 300,
		},
	)
	const tensorData = convertToTensor(data)
	const { inputs, labels } = tensorData

	model = createModel()
	tfvis.show.modelSummary({ name: 'Model Summary' }, model)
	await trainModel(model, inputs, labels)

	// Save the model
	await model.save('localstorage://my-model-1')
}

/**
 * モデルのテスト
 */
export const runTest = async () => {
	if (!model) {
		throw new Error('モデルが読み込まれていません')
	}

	// 訓練データ、テストデータの取得と準備
	const data = await getData()
	const tensorData = convertToTensor(data)

	// Make some predictions using the model and compare them to the
	testModel(model, data, tensorData)
}
