import db from './connection.ts'
import {
  Events,
  Friends,
  Trips,
  Users,
  TripsData,
  UserData,
  EventData,
} from '../../models/flightplan.ts'

//
//USERS
//

// Get all users
export async function getAllUsers() {
  const users = await db('users').select()
  return users as Users[]
}

// Get user by ID
export async function getUserById(id: number) {
  const user = await db('users')
    .select(
      // TODO add auth0 ID
      'email',
      'id',
      'phone_number as phoneNumber',
      'profile_picture as profilePicture',
      'username',
      'first_name as firstName',
      'last_name as lastName',
    )
    .first()
    .where({ id })
  return user as Users
}

// Get Trip by User ID
export async function getTripsByUserId(id: number) {
  const trip = await db('users')
    .join('trip_users', 'users.id', 'trip_users.user_id')
    .join('trips', 'trip_users.trip_id', 'trips.id')
    .where('users.id', id)
    .select(
      'first_name as firstName',
      'last_name as lastName',
      'trip_name as tripName',
      'start_date as startDate',
      'end_date as endDate',
    )
  return trip as Trips[]
}

// Get Following by User ID

export async function getFollowingByUserId(id: number) {
  const follow = await db('users')
    .join('friends_list', 'users.id', 'friends_list.user_id')
    .where('users.id', id)
    .select('users.id as id', 'first_name as firstName', 'username')
  return follow as Friends[]
}

// Add a User

export async function addUser(data: Users) {
  const {
    id,
    email,
    phoneNumber,
    profilePicture,
    username,
    firstName,
    lastName,
  } = data
  await db('users').insert({
    id,
    email,
    phone_number: phoneNumber,
    profile_picture: profilePicture,
    username,
    first_name: firstName,
    last_name: lastName,
  })
}

// Edit a User
export async function updateUser(id: number, updatedUser: UserData) {
  const { email, phoneNumber, profilePicture, username, firstName, lastName } =
    updatedUser

  const newUser = await db('users').where({ id }).update({
    email,
    phone_number: phoneNumber,
    profile_picture: profilePicture,
    username,
    first_name: firstName,
    last_name: lastName,
  })
  return newUser
}

// Delete a User

export async function deleteUser(id: number) {
  await db('users').where({ id }).del()
}

//
//TRIPS
//

// Get all Trips
export async function getAllTrips() {
  const trips = await db('trips').select()
  return trips as Trips[]
}

// Get Trip by ID
export async function getTripById(id: number) {
  const trip = await db('trips').select().first().where({ id })
  console.log(trip)

  return trip as Trips
}

// Get Users by Trip ID
export async function geUsersByTripId(id: number) {
  const trip = await db('trips')
    .join('trip_users', 'trips.id', 'trip_users.trip_id')
    .join('users', 'trip_users.user_id', 'users.id')
    .where('trips.id', id)
    .select(
      'first_name as firstName',
      'last_name as lastName',
      'trip_name as tripName',
      'email',
      'phone_number as phoneNumber',
    )
  return trip as Trips[]
}

// Get Events by Trip ID
export async function getEventsByTripId(id: number) {
  const events = await db('trips')
    .join('events', 'events.trip_id', 'trips.id')
    .where('trips.id', id)
    .select(
      'date',
      'start_time as startTime',
      'end_time as endTime',
      'description',
      'notes',
    )
  return events as Events[]
}

// add attendees to trip
// get trip id, user name/(ids)
// users table, where username = true pluck id of user
// inser into join {trip.id, user.id}
// (multiple = array and map)

// Add User to Trip

// export async function addUserToTrip(id: number, userName: string){
// const user = await db('trips')
// .join('trip_users', 'trips.id', 'trip_users.trip_id')
// .join('users', 'trip_users.user_id', 'users.id').where({userName}).insert()

// }

// Add a Trip
export async function addTrip(data: Trips) {
  const { id, createdBy, tripName, startDate, endDate } = data
  await db('trips').insert({
    id,
    created_by: createdBy,
    trip_name: tripName,
    start_date: startDate,
    end_date: endDate,
  })
}

// Add a Trip by User Id

export async function addTripByUserId() {}

// Delete a Trip
export async function deleteTrip(id: number) {
  await db('trips').where({ id }).del()
}

// Edit a Trip
export async function updateTrip(id: number, updatedTrip: TripsData) {
  const { createdBy, tripName, startDate, endDate } = updatedTrip

  const newTrip = await db('trips').where({ id }).update({
    created_by: createdBy,
    trip_name: tripName,
    start_date: startDate,
    end_date: endDate,
  })
  return newTrip
}

//
//EVENTS
//

// Get all Events
export async function getAllEvents() {
  const events = await db('events').select()
  return events as Events[]
}
// Get event by ID
export async function getEventById(id: number) {
  console.log(id)
  const event = await db('events').select().first().where({ id })
  return event as Events
}

// Get event by Date
export async function getEventsByDate(date: string) {
  const event = await db('events').where('date', date).select()
  return event as Events[]
}
//Add New Event
export async function addNewEvent(newEvent: Events) {
  return await db('events').insert(newEvent)
}

//Add New Event by Date
export async function addNewEventByTripDate(newEvent: EventData) {
  const { date, tripId, startTime, endTime, description, note, createdBy } =
    newEvent

  const newEventDate = await db('events')
    .join('trips', 'trips.id', 'events.trip_id')
    .insert({
      date,
      trip_id: tripId,
      start_time: startTime,
      end_time: endTime,
      description,
      notes: note,
      created_by: createdBy,
    })
    .returning('date')
  return newEventDate
}

//Edit Events by ID
export async function updateEventsById(
  id: number,
  updatedEvent: {
    trip_id: number
    description: string
    date: string
    start_time: string
    end_time: string
    created_by: number
    notes: string
  },
) {
  const eventToUpdate = await db('events').where({ id }).update(updatedEvent)
  return eventToUpdate
}

// Delete Event by ID
export async function deleteEvent(id: number) {
  return await db('events').where({ id }).del()
}

//Get Friends
export async function getFriends(UserId: number) {
  try {
    const friends = await db('friends_list')
      .join('users', 'friends_list.friends_id', '=', 'users.id')
      .select(
        'users.id as id ',
        'users.username as username',
        'users.first_name as firstName',
        'users.last_name as lastName',
        'users.profile_picture as profilePicture',
      )
      .where('friends_list.user_id', UserId)

    return { friends }
  } catch (error) {
    console.error('Error retrieving friends:', error)
    throw new Error('Failed to retrieve friends')
  }
}

//Add User to Friends List

export async function addFriend(userId: number, friendId: number) {
  //Check if userId and friendId exist in user table

  const userExists = await db('users').where('id', userId).first()
  const friendExists = await db('users').where('id', friendId).first()

  if (!userExists || !friendExists) {
    throw new Error('User ID or Friend ID does not exist')
  }

  try {
    const newFriend = await db('friends_list').insert({
      user_id: userId,
      friends_id: friendId,
    })
    return { success: true, message: 'Friend added successfully', newFriend }
  } catch (error) {
    console.error('Error inserting friend:', error)
    throw new Error('Failed to add friend')
  }
}

//Delete Friend from friend list

export async function deleteFriend(userId: number, friendId: number) {
  try {
    const deleteRow = await db('friends_list')
      .where({ user_id: userId, friends_id: friendId })
      .del()
    if (deleteRow > 0) {
      return { success: true, message: 'Friend removed successfully' }
    } else {
      throw new Error('No such friendship exists')
    }
  } catch (error) {
    console.log('Error delete friend:', error)
    throw new Error('Failed to delete friend')
  }
}