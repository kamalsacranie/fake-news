# Northcoders Backend Project

This is a simple news article API which has users, articles associated with
those users, and comments and topics associated with the articles. You can see
all available endpoints at [on the live
version](https://fake-news-plu0.onrender.com/api)

I built this project using `node v19.7.0` and `psql (PostgreSQL) 15.2`. The
`postgres` versioning is handled by `docker` and as such you only need to ensure
that you have the same version or newer of `node`. If you do not opt to use
`docker`, you will need to ensure version parity with both `node` and `psql`.

# Setup

> **Prerequisite**: you will need docker on your machine to seamlessly set up
> the database for the project. *Alternatively*, you can stray from the
> suggested definitions for environment variables below and define them to match
> a `postgres` database on your machine created with `psql`.

First we must clone the repo:

```sh
git clone https://github.com/kamalsacranie/fake-news
```

Then run `npm install` to install of the project's dependencies.

To run the test in the project simply run

```sh
npm test
```

anywhere in the project directory. This will automatically seed the database. If
you want to run the server locally, you simply need to run `npm run start` which
will run the server on at the URL `localhost:9090`.

## Environment setup

To run this project yourself you will need to setup a few things. Firstly, you
will need to create **three different `.env`** files called:

- `.env`: contains base environment variables used in both the test and develop
  cases
- `.env.develop`: contains only environment variables used in ***development***
- `.env.test`: contains only environment variables used in ***testing***

To you the docker container, you must define the following in `.env`:

- `PGUSER=postgres`
- `PGPASSWORD=<any_password>`
- `PGPORT=<any_port>`
- `PGHOST=localhost`

Then, in `env.develop` and `.env.test` you must define `PGDATABASE` as `nc_news`
and `nc_news_test`.^[This naming convention corresponds to how our database is
seeded.]

## Starting the `docker` machine

A `docker-compose.yml` file is provided which allows us use [`docker
compose`](https://github.com/docker/compose) to build our `docker` container.

You can start the machine, then, by running `docker-compose up -d` in the root
directory of the project. This starts a `docker` machine in detached mode on
`localhost:5432`^[You can configure the port in your `.env` files if you already
have something running on 5432.]. This allows our `db/index.js` to connect to
the `postgres` database.

To stop the `docker` container, you simply need to run `docker-compose down` in
the root directory of the project.

# Use of GitHub actions

We use a GitHub action to build our project using the `tsc` command because in
our production server (hosted on [render](https://render.com)) `npm` only
installs non-dev dependencies^[This is the expected behaviour.]. Hence, we use
an action to perform a complete install and run `npm build` which generates our
`dist/` directory which we push to an orphan production repo. Now our Render
server can use track only our production repo which will be garuanteed to have
the latest version of our build on it. It will now be able to run the command
`node ./dist/listen.js` after installing the production dependencies.
