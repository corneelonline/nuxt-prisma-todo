import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

/**
* logic for our api will go here
*/

app.post(`/user`, async (req, res) => {
  const result = await prisma.users.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  })
  res.json(result)
})

app.post('/task', async (req, res) => {
  const { name, due_at, authorEmail } = req.body
  const task = await prisma.tasks.create({
    data: {
      name,
      due_at,
      owner: {
        connectOrCreate: {
          email: authorEmail
        }
      }
    }
  })
  res.status(200).json(task)
})

app.get('/tasks', async (req, res) => {
  const tasks = await prisma.tasks.findMany({
    where: { is_completed: false },
    include: { owner: true }
  })
  res.json(tasks)
})

app.get('/task/:id', async (req, res) => {
  const { id } = req.params
  const task = await prisma.tasks.findUnique({
    where: {
      id: Number(id),
    },
    include: { owner: true }
  })
  res.json(task)
})

app.put('/finish/:id', async (req, res) => {
  const { id } = req.params
  const task = await prisma.tasks.update({
    where: {
      id: Number(id),
    },
    data: { is_completed: true },
  })
  res.json(task)
})

app.get('/completed', async (req, res) => {
  const tasks = await prisma.tasks.findMany({
    where: { is_completed: true },
    include: { owner: true },
  })
  res.json(tasks)
})

app.delete(`/task/:id`, async (req, res) => {
  const { id } = req.params
  const task = await prisma.tasks.delete({
    where: {
      id: parseInt(id),
    },
  })
  res.json(post)
})

app.get('/filterTasks', async (req, res) => {
  const { searchString } = req.query
  const draftTasks = await prisma.tasks.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchString,
          },
        },
      ],
    },
  })
  res.send(draftTasks)
})

export default {
  path: '/api',
  handler: app
}
