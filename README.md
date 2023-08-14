# Feather

An experiment with Next.js and the new [app router](https://nextjs.org/docs/app).

## Development

To begin development, simply duplicate the `.env.example` file, rename it `.env`, and then run:

```
docker-compose up
```

This will create 3 servers: spa, api, and db. The SPA will be available at [http://localhost:3000] and the API will be available at [http://localhost:5000]. The database will be available at [postgresql://postgres:postgres@db:5432/feather]

To end development, run:

```
docker-compose down -v
```

If you install new node packages, you'll have to rebuild the images and delete anonymous volumes:

```
docker-compose up --build -V
```

or 

```
docker-compose down -v
docker-compose up --build
```

This is because we set `node_modules` directories as anonymous volumes, so that they don't get synced with the host volume (the rest of the service directory).
