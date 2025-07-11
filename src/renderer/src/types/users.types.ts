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

export interface EmergencyContact {
  id: string
  name: string
  email: string
  phone: string
  relationship: string
  isPrimaryContact: boolean
  isParentOrGuardian: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Checkin {
  id: string
  checkedAt: string
  belt: BeltColor
  stripes: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Promotion {
  id: string
  promotedAt: string
  belt: BeltColor
  stripes: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface GreenevilleBJJUser {
  id: string
  firstName: string
  lastName: string
  gender: string
  birthday: string
  email: string
  phone: string
  promotions: Promotion[]
  checkins: Checkin[]
  emergencyContact: EmergencyContact
  rank: Promotion
  checkinsAtRank?: Checkin[]
  checkinsLastMonth?: Checkin[]
  checkinsThisMonth?: Checkin[]
  createdAt: string
  updatedAt: string
}
