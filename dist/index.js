"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var process_1 = require("process");
var createSchema = function (props) {
    var schemaPath = props.schemaFilePath || "schema.sql";
    console.log("Writing Schema to " + schemaPath);
    fs_1.writeFileSync(path_1.join(process_1.cwd(), schemaPath), "");
    props.tables.forEach(function (table) {
        console.log("Creating " + table.name + " table");
        createTable(table, schemaPath);
    });
    console.log("Created Schema");
};
exports.createSchema = createSchema;
var createTable = function (props, schemaPath) {
    var tableString = "CREATE TABLE " + props.name + " (\n";
    props.fields.forEach(function (field) {
        return (tableString = tableString.concat(createField(field)).concat("\n"));
    });
    tableString = tableString.concat(")\n");
    fs_1.appendFileSync(path_1.join(process_1.cwd(), schemaPath), tableString);
};
var checkExistsTruth = function (prop, obj) {
    return prop in obj && obj[prop];
};
var createField = function (props) {
    return props.name + " " + props.type + " " + (checkExistsTruth("primaryKey", props) ? "PRIMARY KEY" : "") + " " + (checkExistsTruth("unique", props) ? "UNIQUE" : "") + " " + (checkExistsTruth("notNull", props) ? "NOT NULL" : "") + ";";
};
//# sourceMappingURL=index.js.map