# Sassy Task

## Description

### Design Decision

I have used Prisma ORM for the database operations, it is a modern database toolkit for Javascript and Node.js. It is a good choice for the project because it is easy to use and has a lot of features like migrations, schema generation, and type safety. It also has a good support for relational databases like Mysql, Postgres, and SQLite and it is easy to switch between databases.

### Chosen Technologies

- Node.js
- Express.js
- Mysql
- Prisma ORM
- JWT

### Features

- User can register
- User can login
- User can logout
- User can create a task
- User can update a task by id
- User can delete a task
- User can get all tasks
- User can get a task by id


## Setup & Installation

1. rename env.env file to .env
2. replace the values in .env file with your own values of database url and jwt secret
3. npm install
4. npm run start
5. now you can access the api at http://localhost:3020 or the port you have set in .env file

## Postman Collection

I have created a postman collection for the api, you can find it in the root directory of the project with the name `Sassy Task.postman_collection.json`