import * as tf from '@tensorflow/tfjs'

const genres = [
  'Grunge',
  'Rock',
  'Industrial',
  'Boy Band',
  'Dance',
  'Techno',
] as const
type Genre = (typeof genres)[number]

interface Band {
  name: string
  genres: Genre[]
}

const bands: Band[] = [
  {
    name: 'Nirvana',
    genres: ['Grunge', 'Rock'],
  },
  {
    name: 'Nine Inch Nails',
    genres: ['Grunge', 'Industrial'],
  },
  {
    name: 'Backstreet Boys',
    genres: ['Boy Band', 'Dance'],
  },
  {
    name: 'N Sync',
    genres: ['Boy Band'],
  },
  {
    name: 'Night Club',
    genres: ['Industrial', 'Techno'],
  },
  {
    name: 'Apashe',
    genres: ['Industrial', 'Techno'],
  },
  {
    name: 'STP',
    genres: ['Grunge', 'Rock'],
  },
]

interface User {
  name: string
  votes: Record<Genre, number>
}

const users = [
  {
    name: 'Gant',
    votes: {
      Nirvana: 10,
      'Nine Inch Nails': 9,
      'Backstreet Boys': 1,
      'N Sync': 1,
      'Night Club': 8,
      Apashe: 7,
      STP: 8,
    },
  },
  {
    name: 'Todd',
    votes: {
      Nirvana: 6,
      'Nine Inch Nails': 8,
      'Backstreet Boys': 2,
      'N Sync': 2,
      'Night Club': 0,
      Apashe: 10,
      STP: 0,
    },
  },
  {
    name: 'Jed',
    votes: {
      Nirvana: 0,
      'Nine Inch Nails': 2,
      'Backstreet Boys': 10,
      'N Sync': 9,
      'Night Club': 3,
      Apashe: 7,
      STP: 0,
    },
  },
  {
    name: 'Justin',
    votes: {
      Nirvana: 7,
      'Nine Inch Nails': 4,
      'Backstreet Boys': 2,
      'N Sync': 3,
      'Night Club': 6,
      Apashe: 5,
      STP: 5,
    },
  },
]

export const run = () => {
  return tf.tidy(() => {
    const userVotes = tf.tensor(users.map((user) => Object.values(user.votes)))
    const bandFeats = tf.tensor(
      bands.map((band) =>
        genres.map((genre) => (band.genres.includes(genre) ? 1 : 0)),
      ),
    )

    const userFeats = tf.matMul(userVotes, bandFeats)
    const topUserFeatures = tf.topk(userFeats, genres.length)
    const topGenres = topUserFeatures.indices.arraySync() as number[][]
    return topGenres.map((userTopGenres) =>
      userTopGenres.map((genreIndex) => genres[genreIndex]),
    )
  })
}

console.log(run())
