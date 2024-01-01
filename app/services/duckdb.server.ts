import DuckDB from 'duckdb'
import { Kysely, sql } from 'kysely'
import { DuckDbDialect } from 'kysely-duckdb'

const database = new DuckDB.Database(':memory:')
const db = new Kysely({
  dialect: new DuckDbDialect({ database, tableMappings: {} }),
})
export { db, sql }
