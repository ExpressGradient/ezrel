"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
var pg_1 = require("pg");
var fs_1 = require("fs");
var path_1 = require("path");
var process_1 = require("process");
var createSchema = function (schema) {
    console.time("Generating Relations");
    var schemaString = "";
    schema.tables.forEach(function (table) {
        console.timeLog("Generating Relations", "Generating Table " + table.name);
        schemaString += createTable(table);
    });
    console.timeLog("Generating Relations", "Writing Schema to schema.sql");
    fs_1.writeFileSync(path_1.join(process_1.cwd(), "schema.sql"), schemaString);
    var pool = new pg_1.Pool({ connectionString: schema.connectionString });
    pool.connect().then(function () {
        console.log("Postgres Database Connected");
        console.timeLog("Generating Relations", "Creating Tables in Postgres from the Schema");
    });
    pool.query(schemaString, function (err, res) {
        if (res) {
            console.log(res);
            console.log("Success");
            process_1.exit(0);
        }
        else {
            console.log(err);
            console.log("Failed");
            process_1.exit(1);
        }
    });
};
exports.createSchema = createSchema;
var createTable = function (table) {
    var tableString = "CREATE TABLE " + table.name + " (\n";
    table.fields.forEach(function (field) {
        tableString += createField(field);
    });
    if ("constraints" in table) {
        if ("primaryKey" in table.constraints) {
            tableString += "PRIMARY KEY (";
            table.constraints.primaryKey.forEach(function (field, idx) {
                tableString += field;
                if (idx < table.constraints.primaryKey.length - 1) {
                    tableString += ", ";
                }
            });
            tableString += "),\n";
        }
        if ("references" in table.constraints) {
            tableString += "FOREIGN KEY (";
            table.constraints.references.fields.forEach(function (field, idx) {
                tableString += field;
                if (idx < table.constraints.references.fields.length - 1) {
                    tableString += ", ";
                }
            });
            tableString += ") REFERENCES " + table.constraints.references.on.name + " (";
            table.constraints.references.referenceFields.forEach(function (field, idx) {
                tableString += field;
                if (idx <
                    table.constraints.references.referenceFields.length - 1) {
                    tableString += ", ";
                }
            });
            tableString += ")";
            if ("onDelete" in table.constraints.references) {
                tableString += " ON DELETE " + table.constraints.references.onDelete;
            }
            tableString += ",\n";
        }
        if ("checks" in table.constraints) {
            table.constraints.checks.forEach(function (check) {
                tableString += "CONSTRAINT " + check.name + " CHECK (" + check.check + "),\n";
            });
        }
        if ("unique" in table.constraints) {
            table.constraints.unique.forEach(function (constraint) {
                tableString += "CONSTRAINT " + constraint.name + " UNIQUE (";
                constraint.fields.forEach(function (field, idx) {
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
        tableString += " INHERITS (" + table.inherits.name + ")";
    }
    tableString += ";\n\n";
    if ("indexes" in table) {
        table.indexes.forEach(function (index, idx) {
            if ("unique" in index) {
                tableString += "CREATE UNIQUE INDEX " + index.name + " ON " + table.name + " (";
            }
            else {
                tableString += "CREATE INDEX " + index.name + " on " + table.name + " (";
            }
            index.fields.forEach(function (field, idx) {
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
var createField = function (field) {
    var fieldString = field.name + " " + field.type;
    if ("default" in field) {
        fieldString += " DEFAULT " + field.default;
    }
    if ("constraints" in field) {
        if ("notNull" in field.constraints && field.constraints.notNull) {
            fieldString += " NOT NULL";
        }
        if ("check" in field.constraints) {
            fieldString += " CONSTRAINT " + field.constraints.check.name + " CHECK (" + field.constraints.check.check + ")";
        }
        if ("unique" in field.constraints) {
            fieldString += " CONSTRAINT " + field.constraints.unique.name + " UNIQUE";
        }
    }
    fieldString += ",\n";
    return fieldString;
};
//# sourceMappingURL=index.js.map