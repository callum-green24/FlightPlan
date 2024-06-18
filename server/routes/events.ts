import { Router } from 'express'
// import checkJwt, { JwtRequest } from '../auth0.ts'
// import { StatusCodes } from 'http-status-codes'

import * as db from '../db/db.ts'

const router = Router()
// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await db.getAllEvents()

    res.json(events)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})
// Get event by ID
router.get('event/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const event = await db.getEventById(id)

    if (!event) {
      res.sendStatus(404)
    } else {
      res.json(event)
    }
  } catch (err) {
    next(err)
  }
})
