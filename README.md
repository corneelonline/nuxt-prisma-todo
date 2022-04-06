# nuxt-prisma-todo

## Sources

- [Adding an API and database to your Nuxt App with Prisma](https://dev.to/prisma/adding-an-api-and-database-to-your-nuxt-app-with-prisma-2nlp)
- [Github repo](https://github.com/ruheni/prisma-nuxt)
- [Prisma website](https://www.prisma.io/)

## Step 1: Install Nuxt

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Step 2: Add Prisma to the app

Now that your Nuxt application is running, the next step is to set up Prisma. You’ll first install the Prisma CLI as a dev dependency by running the following command:

```
yarn add prisma --dev
```

Once the installation is complete, run the following command:

```
yarn prisma init
```

The command above creates a folder called `prisma` at the root of your project which contains a file called `schema.prisma` and a `.env` file at the root of the project. The `schema.prisma` defines your database connection and Prisma Client generator.

### Add DB connection to Prisma

In the `.env` file a connection string is added. Modify it so it connects to the database.

```
# In this example it connects to the local db on my Mac
DATABASE_URL="mysql://username:randompassword@localhost:3306/db_name?schema=public"
```

### Add models to Prisma and generate the database tables

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model tasks {
  id            Int      @id @default(autoincrement())
  name          String
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  due_at        DateTime @updatedAt
  is_completed  Boolean  @default(false)
  owner         users?    @relation(fields: [owner_id], references: [id])
  owner_id      Int?
}

model users {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  task  tasks[]
}
```

To sync your data model to your database schema, you’ll need to use prisma migrate CLI.

```
yarn prisma migrate dev --name init
```

The above command will create a migration called init located in the `/prisma/migrations` directory.

## Step 3: Add your serverMiddleware endpoints

Express is used to allow your API endpoints to access the request and response objects.

Go ahead and install Express:

```
yarn add express
```

Create an `api` folder and an `index.js` file that will contain your API handlers:

```
mkdir api
touch api/index.js
```

After creating your `/api/index.js` file, paste in the following code in `index.js`:

```
// index.js
import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

/** 
* logic for our api will go here
*/
export default {
  path: '/api',
  handler: app
}
```

The above code initializes Express and Prisma and exports two properties, `path` and `handler`, which will be registered in `nuxt.config.js` in *Step 4*. The `path` property specifies the route the middleware will be accessible, and `handler` specifies the function executed when invoked. For the rest of this step, you’ll be working in index.js setting up the endpoints and their respective handlers.

### Create a User

The first feature you’ll be implementing is creating a user/ author. The database will be expecting an `email` and an optional `name`. It’s implementation is as follows:

```
// index.js
app.post(`/user`, async (req, res) => {
  const result = await prisma.users.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  })
  res.json(result)
})
```

### Creating a Task

Next, you’ll add the create task endpoint.

```
// index.js
app.post('/task', async (req, res) => {
  const { name, due_at, authorEmail } = req.body
  const task = await prisma.tasks.create({
    data: {
      title,
      content,
      owner: {
        connectOrCreate: {
          email: authorEmail
        }
      }
    }
  })
  res.status(200).json(task)
})
```

### Get uncompleted tasks

Once that is done, you’ll need to be able to view all uncompleted tasks. Prisma lets you specify all relations you’d like to be returned in the response with the `include` property. This is where you’ll add the `owner` relation query to view the respective tasks as well as their `owners`.

```
app.get('/tasks', async (req, res) => {
  const tasks = await prisma.tasks.findMany({
    where: { is_completed: false },
    include: { owner: true }
  })
  res.json(tasks)
})
```

### Get Post by Id

You can get a task by it’s `id` using `findUnique` as follows:

```
// index.js
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
```

### Set a task to completed

```
// index.js
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
```

### Get Feed

Get all the completed tasks.

```
// index.js
app.get('/completed', async (req, res) => {
  const tasks = await prisma.tasks.findMany({
    where: { is_completed: true },
    include: { owner: true },
  })
  res.json(tasks)
})
```

### Deleting a Post

The last CRUD feature is deleting a `Task` record in your database:

```
// index.js
app.delete(`/task/:id`, async (req, res) => {
  const { id } = req.params
  const task = await prisma.tasks.delete({
    where: {
      id: parseInt(id),
    },
  })
  res.json(post)
})
```

The final feature in your application is filtering posts, checking if the `searchString` is found in the `name` of your Tasks.

### Search for a Task

```
// index.js
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
```

## Step 4: Take your API for a spin

Once you’ve modified `nuxt.config.js`, make sure to restart your Nuxt app. You can use Prisma Studio to create your database records. Alternatively, you can use your favorite API testing tool - for example Postman,Insomnia or REST Client - to test your API by making HTTP requests against your API.

In a new terminal window, use the Prisma CLI to startup Prisma Studio.

```
yarn prisma studio
```

The command opens Prisma studio on `localhost:5555`.

- Create a couple of `User` and `Task` records on Prisma Studio and save your changes.
- Since the post isn’t published yet, fetch a list of the drafted posts using the GET api/drafts endpoint.

Check: http://localhost:3000/api/tasks
