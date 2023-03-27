# Northcoders Backend Project

## Setup

> Prerequisite: you will need docker on your machine to seamlessly set up the
> database for the project. *Alternatively*, you can stray from the suggested
> definitions for environment variables below and define them to match a
> `postgres` database on your machine created with `psql`.

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

<Section on docker stup to be added>
