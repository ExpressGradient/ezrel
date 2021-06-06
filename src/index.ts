import { Field, Schema, Table } from "./types";
import { Pool } from "pg";
import { writeFileSync } from "fs";
import { join } from "path";
import { cwd, exit } from "process";

export const createSchema = (schema: Schema): void => {
    console.time("Generating Relations");

    let schemaString: string = "";

    schema.tables.forEach((table) => {
        console.timeLog(
            "Generating Relations",
            `Generating Table ${table.name}`
        );
        schemaString += createTable(table);
    });

    console.timeLog("Generating Relations", "Writing Schema to schema.sql");
    writeFileSync(join(cwd(), "schema.sql"), schemaString);

    const pool = new Pool({ connectionString: schema.connectionString });
    pool.connect().then(() => {
        console.log("Postgres Database Connected");
        console.timeLog(
            "Generating Relations",
            "Creating Tables in Postgres from the Schema"
        );
    });

    pool.query(schemaString, (err, res) => {
        if (res) {
            console.log(res);
            console.log("Success");
            exit(0);
        } else {
            console.log(err);
            console.log("Failed");
            exit(1);
        }
    });
};

const createTable = (table: Table): string => {
    let tableString: string = `CREATE TABLE ${table.name} (\n`;

    table.fields.forEach((field) => {
        tableString += createField(field);
    });

    if ("constraints" in table) {
        if ("primaryKey" in table.constraints) {
            tableString += `PRIMARY KEY (`;
            table.constraints.primaryKey.forEach((field, idx) => {
                tableString += field;
                if (idx < table.constraints.primaryKey.length - 1) {
                    tableString += ", ";
                }
            });
            tableString += "),\n";
        }

        if ("references" in table.constraints) {
            tableString += `FOREIGN KEY (`;

            table.constraints.references.fields.forEach((field, idx) => {
                tableString += field;
                if (idx < table.constraints.references.fields.length - 1) {
                    tableString += ", ";
                }
            });
            tableString += `) REFERENCES ${table.constraints.references.on.name} (`;

            table.constraints.references.referenceFields.forEach(
                (field, idx) => {
                    tableString += field;
                    if (
                        idx <
                        table.constraints.references.referenceFields.length - 1
                    ) {
                        tableString += ", ";
                    }
                }
            );
            tableString += ")";

            if ("onDelete" in table.constraints.references) {
                tableString += ` ON DELETE ${table.constraints.references.onDelete}`;
            }

            tableString += ",\n";
        }

        if ("checks" in table.constraints) {
            table.constraints.checks.forEach((check) => {
                tableString += `CONSTRAINT ${check.name} CHECK (${check.check}),\n`;
            });
        }

        if ("unique" in table.constraints) {
            table.constraints.unique.forEach((constraint) => {
                tableString += `CONSTRAINT ${constraint.name} UNIQUE (`;
                constraint.fields.forEach((field, idx) => {
                    tableString += field;
                    if (idx < constraint.fields.length - 1) {
                        tableString += ",";
                    }
                });
                tableString += "),\n";
            });
        }
    }

    tableString = tableString.slice(0, -2).concat("\n)");

    if ("inherits" in table) {
        tableString += ` INHERITS (${table.inherits.name})`;
    }

    tableString += ";\n\n";

    if ("indexes" in table) {
        table.indexes.forEach((index) => {
            if ("unique" in index) {
                tableString += `CREATE UNIQUE INDEX ${index.name} ON ${table.name} (`;
            } else {
                tableString += `CREATE INDEX ${index.name} on ${table.name} (`;
            }

            index.fields.forEach((field, idx) => {
                tableString += field;
                if (idx < index.fields.length - 1) {
                    tableString += ",";
                }
            });
            tableString += ");\n\n";
        });
    }

    return tableString;
};

const createField = (field: Field): string => {
    let fieldString: string = `${field.name} ${field.type}`;

    if ("default" in field) {
        fieldString += ` DEFAULT ${field.default}`;
    }

    if ("constraints" in field) {
        if ("notNull" in field.constraints && field.constraints.notNull) {
            fieldString += " NOT NULL";
        }

        if ("check" in field.constraints) {
            fieldString += ` CONSTRAINT ${field.constraints.check.name} CHECK (${field.constraints.check.check})`;
        }

        if ("unique" in field.constraints) {
            fieldString += ` CONSTRAINT ${field.constraints.unique.name} UNIQUE`;
        }
    }

    fieldString += ",\n";

    return fieldString;
};
