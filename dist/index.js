"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var process_1 = require("process");
var pg_1 = require("pg");
var createSchema = function (props) {
    console.time("Creating Schema");
    var schemaPath = props.schemaFilePath || "schema.sql";
    fs_1.writeFileSync(path_1.join(process_1.cwd(), schemaPath), "");
    console.timeLog("Creating Schema", "Status: Writing Schema to " + schemaPath);
    props.tables.forEach(function (table) {
        console.timeLog("Creating Schema", "Status: Writing Table " + table.name);
        createTable(table, schemaPath);
    });
    var pool = new pg_1.Pool({ connectionString: props.databaseString });
    console.timeLog("Creating Schema", "Creating Postgres Pool");
    var schema = fs_1.readFileSync(schemaPath, {
        encoding: "utf-8",
    }).toString();
    console.timeLog("Creating Schema", "Creating Tables and Indexes in Postgres");
    pool.query(schema, function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(res);
        }
        pool.end();
    });
    console.timeEnd("Creating Schema");
    console.log("Done");
};
exports.createSchema = createSchema;
var createTable = function (props, schemaPath) {
    var tableString = "CREATE TABLE " + props.name + " (\n";
    props.fields.forEach(function (field, idx) {
        return (tableString = tableString
            .concat(createField(field, idx === props.fields.length - 1))
            .trim()
            .concat("\n"));
    });
    tableString = tableString.concat(")");
    if (checkExistsTruth("inherits", props)) {
        tableString = tableString.concat(" INHERITS (" + props.inherits + ")");
    }
    tableString = tableString.concat(";\n\n");
    fs_1.appendFileSync(path_1.join(process_1.cwd(), schemaPath), tableString);
    if (checkExistsTruth("indexes", props)) {
        var indexStrings_1 = "";
        props.indexes.forEach(function (index) {
            console.timeLog("Creating Schema", "Status: Writing Index " + index.name);
            indexStrings_1 = indexStrings_1.concat(createIndex(index, props.name));
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
var createField = function (props, isLastField) {
    if (isLastField === void 0) { isLastField = false; }
    var fieldString = props.name + " " + props.type;
    if (checkExistsTruth("default", props)) {
        fieldString = fieldString.concat(" DEFAULT " + props.default);
    }
    if (checkExistsTruth("primaryKey", props)) {
        fieldString = fieldString.concat(" PRIMARY KEY");
        if (!isLastField) {
            fieldString = fieldString.concat(",");
        }
        return fieldString;
    }
    if (checkExistsTruth("references", props)) {
        fieldString = fieldString.concat(" REFERENCES " + props.references.table + " (");
        props.references.fields.forEach(function (field, idx) {
            fieldString = fieldString.concat(field);
            if (idx < props.references.fields.length - 1) {
                fieldString = fieldString.concat(", ");
            }
            else {
                fieldString = fieldString.concat(")");
            }
        });
        if (!isLastField) {
            fieldString = fieldString.concat(",");
        }
        return fieldString;
    }
    if (checkExistsTruth("unique", props)) {
        fieldString = fieldString.concat(" UNIQUE");
    }
    if (checkExistsTruth("notNull", props)) {
        fieldString = fieldString.concat(" NOT NULL");
    }
    if (!isLastField) {
        fieldString = fieldString.concat(",");
    }
    return fieldString;
};
//# sourceMappingURL=index.js.map