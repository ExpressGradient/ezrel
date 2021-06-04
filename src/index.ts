import { Field, Index, Schema, Table } from "./types";
import { appendFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";

export const createSchema = (props: Schema): void => {
    console.time("Creating Schema");
    const schemaPath: string = props.schemaFilePath || "schema.sql";

    writeFileSync(join(cwd(), schemaPath), "");
    console.timeLog(
        "Creating Schema",
        `Status: Writing Schema to ${schemaPath}`
    );

    props.tables.forEach((table) => {
        createTable(table, schemaPath);
        console.timeLog(
            "Creating Schema",
            `Status: Created Table ${table.name}`
        );
    });

    console.timeEnd("Creating Schema");
    console.log("Done");
};

const createTable = (props: Table, schemaPath: string): void => {
    let tableString: string = `CREATE TABLE ${props.name} (\n`;

    props.fields.forEach(
        (field) =>
            (tableString = tableString
                .concat(createField(field))
                .trim()
                .concat("\n"))
    );

    tableString = tableString.concat(");\n\n");

    appendFileSync(join(cwd(), schemaPath), tableString);

    if (checkExistsTruth("indexes", props)) {
        let indexStrings: string = "";
        props.indexes.forEach((index) => {
            indexStrings = indexStrings.concat(createIndex(index, props.name));
            console.timeLog(
                "Creating Schema",
                `Status: Created Index ${index.name}`
            );
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

const createField = (props: Field): string => {
    let fieldString: string = `${props.name} ${props.type}`;

    if (checkExistsTruth("default", props)) {
        fieldString = fieldString.concat(` DEFAULT ${props.default}`);
    }

    if (checkExistsTruth("primaryKey", props)) {
        fieldString = fieldString.concat(" PRIMARY KEY;");
        return fieldString;
    }

    if (checkExistsTruth("references", props)) {
        fieldString = fieldString.concat(
            ` REFERENCES ${props.references.table} ${props.references.field};`
        );
        return fieldString;
    }

    if (checkExistsTruth("unique", props)) {
        fieldString = fieldString.concat(` UNIQUE`);
    }

    if (checkExistsTruth("notNull", props)) {
        fieldString = fieldString.concat(` NOT NULL`);
    }

    fieldString = fieldString.concat(`;`);

    return fieldString;
};
