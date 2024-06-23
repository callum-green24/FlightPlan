import { useLocation, useNavigate } from 'react-router-dom'
import { format, eachDayOfInterval } from 'date-fns'
import { AddTravller } from '../components/AddTraveller'
import { useEffect, useState } from 'react'
import { User } from '@auth0/auth0-react'

const generateDateList = (startDate: Date, endDate: Date): Date[] => {
  return eachDayOfInterval({ start: startDate, end: endDate })
}

export function Schedule() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const startDate = searchParams.get('startDate') || new Date().toISOString()
  const endDate = searchParams.get('endDate') || new Date().toISOString()
  const tripName = searchParams.get('tripName') || 'Trip'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const dates = generateDateList(start, end)

  const [selectedFriends, setSelectedFriends] = useState<User[]>([])

  useEffect(() => {
    const storedFriends = localStorage.getItem('addedFriends')
    if (storedFriends) {
      setSelectedFriends(JSON.parse(storedFriends))
    }
  }, []) // Retrieve from localStorage on component mount

  const handleSelectFriend = (friend: User) => {
    setSelectedFriends((prevFriends) => [...prevFriends, friend])
  }

  const handleRemoveFriend = (friendId: number) => {
    setSelectedFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== friendId),
    )
  }

  useEffect(() => {
    localStorage.setItem('addedFriends', JSON.stringify(selectedFriends))
  }, [selectedFriends]) // Store to localStorage whenever selectedFriends changes

  const handleDateClick = (date: Date) => {
    navigate(`/date/${format(date, 'yyyy-MM-dd')}`)
  }

  return (
    <section className="section">
      <div className="container is-fluid">
        <h1 className="title has-text-centered">Trip Schedule</h1>
        <h2 className="subtitle has-text-centered">{tripName}</h2>
        <div className="travellers-container">
          <h3 className="has-text-centered">
            Click + to add a traveller to the trip, double click to remove them
          </h3>
          <div className="travellers-wrapper">
            <AddTravller
              onSelectFriend={handleSelectFriend}
              onRemoveFriend={handleRemoveFriend}
            />
          </div>
        </div>
        <div className="dates-list-container">
          <ul>
            {dates.map((date, index) => (
              <li key={index} className="date-item">
                <span className="date-text">
                  {format(date, 'EEE dd MMM').toUpperCase()}
                </span>
                <button
                  className="button is-primary"
                  onClick={() => handleDateClick(date)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
