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

// in your Members.tsx (or a shared constants file)
export const BELT_ORDER = [
  BeltColor.WHITE,
  BeltColor.GREY_WHITE,
  BeltColor.GREY,
  BeltColor.GREY_BLACK,
  BeltColor.YELLOW_WHITE,
  BeltColor.YELLOW,
  BeltColor.YELLOW_BLACK,
  BeltColor.ORANGE_WHITE,
  BeltColor.ORANGE,
  BeltColor.ORANGE_BLACK,
  BeltColor.GREEN_WHITE,
  BeltColor.GREEN,
  BeltColor.GREEN_BLACK,
  BeltColor.BLUE,
  BeltColor.PURPLE,
  BeltColor.BROWN,
  BeltColor.BLACK,
  BeltColor.RED_BLACK,
  BeltColor.RED_WHITE,
  BeltColor.RED
] as const

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
  checkins: Checkin[]
  hasSignedWaiver: boolean
  rank: Promotion
  createdAt: string
  updatedAt: string
}
