import { Field, Schema, Table } from "./types";
import { appendFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";

export const createSchema = (props: Schema): void => {
    const schemaPath: string = props.schemaFilePath || "schema.sql";
    console.log(`Writing Schema to ${schemaPath}`);
    writeFileSync(join(cwd(), schemaPath), "");
    props.tables.forEach((table) => {
        console.log(`Creating ${table.name} table`);
        createTable(table, schemaPath);
    });
    console.log("Created Schema");
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

    tableString = tableString.concat(")\n\n");

    appendFileSync(join(cwd(), schemaPath), tableString);
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
