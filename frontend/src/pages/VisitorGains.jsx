import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { useAuth } from '../contexts/AuthContext'
import { apiRequest } from '../utils/api'

function VisitorGains() {
  const [bets, setBets] = useState([])
  const [totalGains, setTotalGains] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchBets()
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    const socket = io('http://localhost:5000')

    socket.on('betsResolved', (data) => {
      if (data.userId === user.id) {
        fetchBets()
      }
    })

    return () => {
      socket.off('betsResolved')
      socket.disconnect()
    }
  }, [user])

  async function fetchBets() {
    try {
      const response = await apiRequest('/api/bets')
      const userBets = response.filter(bet => bet.userId === user?.id)
      setBets(userBets)
      calculateGains(userBets)
    } catch (error) {
      console.error('Error fetching bets:', error)
    }
  }

  function calculateGains(bets) {
    let gains = 0
    bets.forEach(bet => {
      if (bet.status === 'won') {
        gains += bet.amount * bet.odds
      } else if (bet.status === 'lost') {
        gains -= bet.amount
      }
    })
    setTotalGains(gains)
  }

  if (!user) {
    return <div>Veuillez vous connecter pour voir vos gains.</div>
  }

  return (
    <div>
      <h1>Mes Gains et Pertes</h1>
      <p>Total : {totalGains.toFixed(2)}€</p>
      <h2>Détail des Paris</h2>
      <ul>
        {bets.map(bet => {
          let gain = 0
          if (bet.status === 'won') {
            gain = bet.amount * bet.odds
          } else if (bet.status === 'lost') {
            gain = -bet.amount
          }
          return (
            <li key={bet.id}>
              Pari {bet.amount}€ sur match {bet.matchId} - {bet.prediction} (cote {bet.odds}) - {bet.status} ({gain > 0 ? '+' : ''}{gain.toFixed(2)}€)
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default VisitorGains