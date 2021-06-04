"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var process_1 = require("process");
var createSchema = function (props) {
    console.time("Creating Schema");
    var schemaPath = props.schemaFilePath || "schema.sql";
    fs_1.writeFileSync(path_1.join(process_1.cwd(), schemaPath), "");
    console.timeLog("Creating Schema", "Status: Writing Schema to " + schemaPath);
    props.tables.forEach(function (table) {
        createTable(table, schemaPath);
        console.timeLog("Creating Schema", "Status: Created Table " + table.name);
    });
    console.timeEnd("Creating Schema");
    console.log("Done");
};
exports.createSchema = createSchema;
var createTable = function (props, schemaPath) {
    var tableString = "CREATE TABLE " + props.name + " (\n";
    props.fields.forEach(function (field) {
        return (tableString = tableString
            .concat(createField(field))
            .trim()
            .concat("\n"));
    });
    tableString = tableString.concat(");\n\n");
    fs_1.appendFileSync(path_1.join(process_1.cwd(), schemaPath), tableString);
    if (checkExistsTruth("indexes", props)) {
        var indexStrings_1 = "";
        props.indexes.forEach(function (index) {
            indexStrings_1 = indexStrings_1.concat(createIndex(index, props.name));
            console.timeLog("Creating Schema", "Status: Created Index " + index.name);
        });
        fs_1.appendFileSync(path_1.join(process_1.cwd(), schemaPath), indexStrings_1);
    }
};
var createIndex = function (props, table) {
    var indexString = "CREATE" + (checkExistsTruth("unique", props) ? " UNIQUE" : "") + " INDEX " + props.name + " ON " + table + " (";
    props.fields.forEach(function (field, idx) {
        if (idx === props.fields.length - 1) {
            indexString = indexString.concat(field + ");\n\n");
        }
        else {
            indexString = indexString.concat(field + ", ");
        }
    });
    return indexString;
};
var checkExistsTruth = function (prop, obj) {
    return prop in obj && obj[prop];
};
var createField = function (props) {
    var fieldString = props.name + " " + props.type;
    if (checkExistsTruth("default", props)) {
        fieldString = fieldString.concat(" DEFAULT " + props.default);
    }
    if (checkExistsTruth("primaryKey", props)) {
        fieldString = fieldString.concat(" PRIMARY KEY;");
        return fieldString;
    }
    if (checkExistsTruth("references", props)) {
        fieldString = fieldString.concat(" REFERENCES " + props.references.table + " " + props.references.field + ";");
        return fieldString;
    }
    if (checkExistsTruth("unique", props)) {
        fieldString = fieldString.concat(" UNIQUE");
    }
    if (checkExistsTruth("notNull", props)) {
        fieldString = fieldString.concat(" NOT NULL");
    }
    fieldString = fieldString.concat(";");
    return fieldString;
};
//# sourceMappingURL=index.js.map