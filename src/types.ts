export interface Schema {
    tables: Array<Table>;
    connectionString: string;
}

export interface Table {
    name: string;
    fields: Array<Field>;
    constraints?: {
        primaryKey?: {
            name: string;
            fields: Array<string>;
        };
        references?: Array<{
            name: string;
            fields: Array<string>;
            on: Table;
            referenceFields: Array<string>;
            onDelete?: "RESTRICT" | "CASCADE";
        }>;
        checks?: Array<{
            name: string;
            check: string;
        }>;
        unique?: Array<{
            name: string;
            fields: Array<string>;
        }>;
    };
    inherits?: Table;
    indexes?: Array<{
        name: string;
        fields: Array<string>;
        unique?: boolean;
    }>;
}

export interface Field {
    name: string;
    type: string;
    default?: any;
    constraints?: {
        notNull?: boolean;
        check?: {
            name: string;
            check: string;
        };
        unique?: {
            name: string;
        };
    };
    generated?: string;
}
