import { Field, Index, Schema, Table } from "./types";
import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { Pool } from "pg";

export const createSchema = (props: Schema): void => {
    console.time("Creating Schema");
    const schemaPath: string = props.schemaFilePath || "schema.sql";

    writeFileSync(join(cwd(), schemaPath), "");
    console.timeLog(
        "Creating Schema",
        `Status: Writing Schema to ${schemaPath}`
    );

    props.tables.forEach((table) => {
        console.timeLog(
            "Creating Schema",
            `Status: Writing Table ${table.name}`
        );
        createTable(table, schemaPath);
    });

    const pool = new Pool({ connectionString: props.databaseString });
    console.timeLog("Creating Schema", "Creating Postgres Pool");

    const schema: string = readFileSync(schemaPath, {
        encoding: "utf-8",
    }).toString();
    console.timeLog(
        "Creating Schema",
        "Creating Tables and Indexes in Postgres"
    );

    pool.query(schema, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
        pool.end();
    });

    console.timeEnd("Creating Schema");
    console.log("Done");
};

const createTable = (props: Table, schemaPath: string): void => {
    let tableString: string = `CREATE TABLE ${props.name} (\n`;

    props.fields.forEach(
        (field, idx) =>
            (tableString = tableString
                .concat(createField(field, idx === props.fields.length - 1))
                .trim()
                .concat("\n"))
    );

    tableString = tableString.concat(")");

    if (checkExistsTruth("inherits", props)) {
        tableString = tableString.concat(` INHERITS (${props.inherits})`);
    }

    tableString = tableString.concat(";\n\n");

    appendFileSync(join(cwd(), schemaPath), tableString);

    if (checkExistsTruth("indexes", props)) {
        let indexStrings: string = "";
        props.indexes.forEach((index) => {
            console.timeLog(
                "Creating Schema",
                `Status: Writing Index ${index.name}`
            );
            indexStrings = indexStrings.concat(createIndex(index, props.name));
        });
        appendFileSync(join(cwd(), schemaPath), indexStrings);
    }
};

const createIndex = (props: Index, table: string): string => {
    let indexString: string = `CREATE${
        checkExistsTruth("unique", props) ? " UNIQUE" : ""
    } INDEX ${props.name} ON ${table} (`;

    props.fields.forEach((field, idx) => {
        if (idx === props.fields.length - 1) {
            indexString = indexString.concat(`${field});\n\n`);
        } else {
            indexString = indexString.concat(`${field}, `);
        }
    });

    return indexString;
};

const checkExistsTruth = (prop: string, obj: object): boolean => {
    return prop in obj && obj[prop];
};

const createField = (props: Field, isLastField: boolean = false): string => {
    let fieldString: string = `${props.name} ${props.type}`;

    if (checkExistsTruth("default", props)) {
        fieldString = fieldString.concat(` DEFAULT ${props.default}`);
    }

    if (checkExistsTruth("primaryKey", props)) {
        fieldString = fieldString.concat(" PRIMARY KEY");
        if (!isLastField) {
            fieldString = fieldString.concat(`,`);
        }
        return fieldString;
    }

    if (checkExistsTruth("references", props)) {
        fieldString = fieldString.concat(
            ` REFERENCES ${props.references.table} (`
        );
        props.references.fields.forEach((field: string, idx) => {
            fieldString = fieldString.concat(field);
            if (idx < props.references.fields.length - 1) {
                fieldString = fieldString.concat(", ");
            } else {
                fieldString = fieldString.concat(")");
            }
        });
        if (!isLastField) {
            fieldString = fieldString.concat(`,`);
        }
        return fieldString;
    }

    if (checkExistsTruth("unique", props)) {
        fieldString = fieldString.concat(` UNIQUE`);
    }

    if (checkExistsTruth("notNull", props)) {
        fieldString = fieldString.concat(` NOT NULL`);
    }

    if (!isLastField) {
        fieldString = fieldString.concat(`,`);
    }

    return fieldString;
};
