import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage'
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema'
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import {
  checkinSchema,
  emergencyContactSchema,
  promotionSchema,
  userSchema
} from './db/member.schema'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBJsonDumpPlugin)
addRxPlugin(RxDBDevModePlugin)
addRxPlugin(RxDBMigrationSchemaPlugin)
addRxPlugin(RxDBUpdatePlugin)

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

  // await db.remove()

  await db.addCollections({
    user: {
      schema: userSchema,
      migrationStrategies: {
        1: (oldDoc) => {
          return {
            ...oldDoc,
            hasSignedWaiver: false
          }
        }
      }
    },
    checkin: {
      schema: checkinSchema
    },
    promotion: {
      schema: promotionSchema
    },
    emergencyContact: {
      schema: emergencyContactSchema,
      migrationStrategies: {
        1: (oldDoc) => {
          return {
            ...oldDoc,
            isPrimaryContact: false
          }
        }
      }
    }
  })

  db.user.preInsert((plainData) => {
    const now = new Date().toISOString()
    plainData.createdAt = now
    plainData.updatedAt = now
  }, false)

  db.checkin.preInsert((plainData) => {
    const now = new Date().toISOString()
    plainData.createdAt = now
    plainData.updatedAt = now
  }, false)

  db.promotion.preInsert((plainData) => {
    const now = new Date().toISOString()
    plainData.createdAt = now
    plainData.updatedAt = now
  }, false)

  db.emergencyContact.preInsert((plainData) => {
    const now = new Date().toISOString()
    plainData.createdAt = now
    plainData.updatedAt = now
  }, false)

  return db
}
