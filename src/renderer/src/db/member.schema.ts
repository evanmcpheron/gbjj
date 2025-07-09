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
    userId: { type: 'string', ref: 'users' }
  },
  required: ['id', 'promotedAt', 'belt', 'stripes', 'userId']
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
    userId: { type: 'string', ref: 'users' }
  },
  required: ['id', 'checkedAt', 'belt', 'stripes']
}

export const userSchema = {
  title: 'user schema',
  version: 0,
  description: 'Represents a Greeneville BJJ club user',
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1, maxLength: 255, primary: true },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string' },
    birthday: { type: 'string', format: 'date-time' },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string' },
    belt: { type: 'string', enum: beltColorEnum },
    stripes: { type: 'integer', minimum: 0 }
  },
  required: [
    'id',
    'firstName',
    'lastName',
    'gender',
    'birthday',
    'email',
    'phone',
    'belt',
    'stripes',
    'checkins'
  ]
}
