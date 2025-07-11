export enum BeltColor {
  WHITE = 'WHITE',
  GREY = 'GREY',
  GREY_WHITE = 'GREY_WHITE',
  GREY_BLACK = 'GREY_BLACK',
  YELLOW = 'YELLOW',
  YELLOW_WHITE = 'YELLOW_WHITE',
  YELLOW_BLACK = 'YELLOW_BLACK',
  ORANGE = 'ORANGE',
  ORANGE_WHITE = 'ORANGE_WHITE',
  ORANGE_BLACK = 'ORANGE_BLACK',
  GREEN = 'GREEN',
  GREEN_WHITE = 'GREEN_WHITE',
  GREEN_BLACK = 'GREEN_BLACK',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  BROWN = 'BROWN',
  BLACK = 'BLACK',
  RED_BLACK = 'RED_BLACK',
  RED_WHITE = 'RED_WHITE',
  RED = 'RED'
}

export const beltColorEnum = [
  'WHITE',
  'GREY',
  'GREY_WHITE',
  'GREY_BLACK',
  'YELLOW',
  'YELLOW_WHITE',
  'YELLOW_BLACK',
  'ORANGE',
  'ORANGE_WHITE',
  'ORANGE_BLACK',
  'GREEN',
  'GREEN_WHITE',
  'GREEN_BLACK',
  'BLUE',
  'PURPLE',
  'BROWN',
  'BLACK',
  'RED_BLACK',
  'RED_WHITE',
  'RED'
] as const

export const emergencyContactSchema = {
  title: 'emergency contact schema',
  version: 1,
  description: 'Schema for emergency contacts',
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 255 },
    name: { type: 'string', minLength: 1, maxLength: 255 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    relationship: { type: 'string' },
    isParentOrGuardian: { type: 'boolean' },
    isPrimaryContact: { type: 'boolean' },
    userId: { type: 'string', ref: 'users' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: [
    'id',
    'name',
    'email',
    'phone',
    'relationship',
    'isParentOrGuardian',
    'isPrimaryContact',
    'userId',
    'updatedAt'
  ]
}

export const promotionSchema = {
  title: 'promotion schema',
  version: 0,
  description: 'Schema for promotion times',
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 255 },
    promotedAt: { type: 'string', format: 'date-time' },
    belt: { type: 'string', enum: beltColorEnum },
    stripes: { type: 'integer', minimum: 0 },
    userId: { type: 'string', ref: 'users' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'promotedAt', 'belt', 'stripes', 'userId', 'updatedAt']
}

export const checkinSchema = {
  title: 'checkin schema',
  version: 0,
  description: 'Schema for checkin records',
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 255 },
    checkedAt: { type: 'string', format: 'date-time' },
    belt: { type: 'string', enum: beltColorEnum },
    stripes: { type: 'integer', minimum: 0 },
    userId: { type: 'string', ref: 'users' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'checkedAt', 'belt', 'stripes', 'updatedAt']
}

export const userSchema = {
  title: 'user schema',
  version: 0,
  description: 'Represents a BJJ club user',
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 255 },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string' },
    birthday: { type: 'string', format: 'date-time' },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    createdAt: {
      type: 'string',

      format: 'date-time'
    },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'firstName', 'lastName', 'gender', 'birthday', 'email', 'phone', 'updatedAt']
}
