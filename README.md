# nuxt-prisma-todo

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

