import { db, sql } from '~/services/duckdb.server'

interface CarData {
  id: number
  name: string
  milesPerGallon: number
  horsepower: number
}

export const loadData = async () => {
  const result = await sql<Omit<CarData, 'id'>>`
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

  return result.rows.map((row, i) => ({ id: i + 1, ...row }))
}
