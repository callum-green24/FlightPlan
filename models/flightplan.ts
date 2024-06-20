export interface Trips {
  id: number
  createdBy: string
  tripName: string
  startDate: string
  endDate: string
}

export type TripsData = Omit<Trips, 'id'>

export interface Events {
  id: number
  tripId: number
  description: string
  date: string
  startTime: string
  endTime: string
  note: string
  createdBy: string
}
export type EventData = Omit<Events, 'id'>

export interface Users {
  id: number | undefined
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  profilePicture: string
}

export type UserData = Omit<Users, 'id'>

export interface Trip_users {
  id: number
  tripId: number
  userId: number
}

export interface Friends {
  id: number
  firstName: string
  username: string
}
