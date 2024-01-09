# mysql8-introspect

just some functions that can generate both a prisma schema and kysely types from a mysql8 database, with full control over type mappings.

intended workflow is still using schema.prisma as source of truth.

## example usage

```ts
import { db } from "./db"; //your kysely instance eg new Kysely<DB>({dialect})
import { writeFileSync } from "fs";

const info = await introspect(db);
const prismastring = generatePrismaSchema(info);
const typescriptstring = generateTypescriptTypes(info);

writeFileSync("pulled.prisma", prismastring);
writeFileSync("types.ts", typescriptstring);
```

## notes

Other packages exist..

- `prisma-kysely` can create kysely types (only) from a prisma schema
- `kysely-codegen` can create kysely types (only) from a database
