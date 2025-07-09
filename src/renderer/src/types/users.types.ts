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

export interface Checkins {
  id: string
  checkedAt: string
  belt: BeltColor
  stripes: number
  userId: string
}

export interface GreenevilleBJJUser {
  id: string
  firstName: string
  lastName: string
  gender: string
  birthday: string
  email: string
  phone: string
  belt: BeltColor
  stripes: number
}
