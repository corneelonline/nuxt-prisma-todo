# nuxt-prisma-todo

## Build Setup

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

## Add Prisma to the app

Now that your Nuxt application is running, the next step is to set up Prisma. You’ll first install the Prisma CLI as a dev dependency by running the following command:

```
yarn add prisma --dev
```

Once the installation is complete, run the following command:

```
yarn prisma init
```

The command above creates a folder called `prisma` at the root of your project which contains a file called `schema.prisma` and a `.env` file at the root of the project. The `schema.prisma` defines your database connection and Prisma Client generator.
