import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage'
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { checkinSchema, userSchema } from './db/member.schema'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'

addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBDevModePlugin)
addRxPlugin(RxDBMigrationSchemaPlugin)

export const initDb = async () => {
  if (process.env.NODE_ENV !== 'production') {
    await import('rxdb/plugins/dev-mode').then((module) => addRxPlugin(module.RxDBDevModePlugin))
  }

  const db = await createRxDatabase({
    name: 'gbjjdb',
    storage: wrappedValidateAjvStorage({
      storage: getRxStorageLocalstorage()
    }),
    ignoreDuplicate: true
  })

  await db.addCollections({
    user: {
      schema: userSchema
    },
    checkins: {
      schema: checkinSchema
    }
  })

  return db
}
