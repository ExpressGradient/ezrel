# EzRel
Easy Peasy Relations

## About
Input the structure of your data in plain JS/TS objects with a PostgreSQL instance connection and get the equivalent SQL which will be queried against the database to create the schema.

## Quickstart
Install the package as a dev dependency.  
```
npm install --dev expressgradient/ezrel
```

Import the `createSchema` function and supply the table objects.  
```js
const { createSchema } = require("@expressgradient/ezrel");

const Demo = {
    name: "demo",
    fields: [
	{ name: "id", type: "INTEGER" },
	{ name: "username", type: "USERNAME" }
    ],
    constraints: {
	primaryKey: { name: "DEMO_PK", fields: ["id"] }
    }
};

createSchema({
    tables: [Demo],
    connectionString: "postgres://username:password@host:port/db"
});
```

> If you are a TypeScript fan like me, there's a `types.ts` file which has all the interfaces for Table and Field objects.  

Now simply run the file. You'll have a `schema.sql` file which contains the create script. Also verify the database for the schema.

## Options
* Default
* Not Null
* Checks
* Unique
* Generated Columns
* Primary Key
* Foreign Keys
* Inheritance
* Indexes

See `src/types.ts` for more clarity.
