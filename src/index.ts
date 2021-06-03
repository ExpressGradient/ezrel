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
            (tableString = tableString.concat(createField(field)).concat("\n"))
    );

    tableString = tableString.concat(")\n");

    appendFileSync(join(cwd(), schemaPath), tableString);
};

const checkExistsTruth = (prop: string, obj: object): boolean => {
    return prop in obj && obj[prop];
};

const createField = <T>(props: Field<T>): string => {
    return `${props.name} ${props.type} ${
        checkExistsTruth("primaryKey", props) ? "PRIMARY KEY" : ""
    } ${checkExistsTruth("unique", props) ? "UNIQUE" : ""} ${
        checkExistsTruth("notNull", props) ? "NOT NULL" : ""
    };`;
};
