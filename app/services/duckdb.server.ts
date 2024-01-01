import DuckDB from 'duckdb'
import { Kysely, sql } from 'kysely'
import { DuckDbDialect } from 'kysely-duckdb'

const createDatabase = <T>() => {
  const database = new DuckDB.Database(':memory:')
  return new Kysely<T>({
    dialect: new DuckDbDialect({ database, tableMappings: {} }),
  })
}
export { createDatabase, sql }
