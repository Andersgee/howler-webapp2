# edge-stack

nextjs project boilerplate configured according to current taste

```sh
pnpm create @andersgee/edge-stack
```

## first steps

1. install `pnpm install`
2. rename `.env.example` to `.env` and `.env.db.example` to `.env.db`
3. [start database](#start-database)
4. push schema `pnpm dbpush`
5. start developing `pnpm dev`

## sensible second steps

1. edit `public/manifest.webmanifest`
2. replace `public/icons`
3. edit default site_name in `src/utils/seo.ts`
4. follow steps in env file to configure oauth applications

## notes

- oauth boilerplate
- some utility functions
- trpc edge runtime for client components
  - eg `const { data } = api.post.getById.useQuery({postId})`
- call trpc procedures directly as regular functions in server components
  - eg `const data = await api.post.getById({postId})`
  - note that calling protected procedures `{ api, user } = await apiRsc()` in server components will opt route into dynamic rendering at request time
  - there is also `const { api } = apiRscPublic()` that does _not_ require dynamic rendering at request time, only for publicProcedures
- schema.prisma for schema definition only
  - `pnpm dbpush` to push schema and generate types for kysely
  - or just `pnpm dbpull` to generate types for kysely
- kysely query builder with fetch driver for nextjs server side data cache (http cache) compatible db queries
  - eg `db({cache: "force-cache"}).selectFrom("Post").selectAll().execute()`
  - or `db({next: {tags: ["some-tag"]}}).selectFrom("Post").selectAll().execute()`
    - somewhere else: `revalidateTag("some-tag")`
  - or `db({next: {revalidate: 10}}).selectFrom("Post").selectAll().execute()`
  - regular `db()...` without args defaults to {cache:"no-store}
- tailwind with themed colors via css variables
  - eg `bg-some-color-700` instead of `bg-some-color-700 dark:bg-some-other-color-300`.
  - utility for generating css variables / config object from theme colors here: [todo create repo]()
- bunch of more specific configurations eslint, tailwind, next
- about server side data cache:
  - see [data cache usage and pricing](https://vercel.com/docs/infrastructure/data-cache/limits-and-pricing)
  - The maximum size of an item in the cache is 2 MB. Items larger than this will not be cached.
  - The total data cache size has a "limit based on your subscription" but unclear what the number is... anyway, if exceeding it then "least recently used" items will be removed.
  - you can manually clear the data cache on vercel, project settings->data cache->purge everything

### todo / future

- At some point `trpc: "^11"` will be released. Until then, use `trpc: "next"` to be able to use `react-query: "^5"`
- At some point partial prerendering will be stable in nextjs and edge runtime will support static pages. For now, default all pages to edge runtime in root layout (meaning only dynamic rendering of pages). This is not as big of an issue as one would perhaps expect, since we can use server side data cache to avoid any actual data fetching, if we want, even on dynamic pages.

## start database

use the docker image `andersgee/http-mysql8-sqlx` for example:

```sh
mkdir mysqldatadir

sudo docker run -d \
--name edge-stack-db \
--network host \
--env-file ./.env.db \
--mount type=bind,source="$(pwd)"/mysqldatadir,destination=/var/lib/mysql \
--restart unless-stopped \
andersgee/http-mysql8-sqlx:0.31
```

other

```sh
#backup
sudo docker stop edge-stack-db
sudo cp -r mysqldatadir mysqldatadir_backup
sudo docker start edge-stack-db
#remove
sudo docker rm edge-stack-db
sudo rm -r mysqldatadir
```
