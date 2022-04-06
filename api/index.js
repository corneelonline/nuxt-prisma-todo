import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

/**
* logic for our api will go here
*/

app.post(`/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  })
  res.json(result)
})

app.post('/task', async (req, res) => {
  const { name, due_at, authorEmail } = req.body
  const task = await prisma.task.create({
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
  const tasks = await prisma.task.findMany({
    where: { is_completed: false },
    include: { owner: true }
  })
  res.json(tasks)
})

app.get('/task/:id', async (req, res) => {
  const { id } = req.params
  const task = await prisma.task.findUnique({
    where: {
      id: Number(id),
    },
    include: { owner: true }
  })
  res.json(task)
})

app.put('/finish/:id', async (req, res) => {
  const { id } = req.params
  const task = await prisma.task.update({
    where: {
      id: Number(id),
    },
    data: { is_completed: true },
  })
  res.json(task)
})

app.get('/completed', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { is_completed: true },
    include: { owner: true },
  })
  res.json(tasks)
})

app.delete(`/task/:id`, async (req, res) => {
  const { id } = req.params
  const task = await prisma.task.delete({
    where: {
      id: parseInt(id),
    },
  })
  res.json(post)
})

app.get('/filterTasks', async (req, res) => {
  const { searchString } = req.query
  const draftTasks = await prisma.task.findMany({
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
