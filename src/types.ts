export type Schema = {
    tables: Array<Table>;
    databaseString: string;
    schemaFilePath?: string;
};

export type Index = {
    name: string;
    fields: string[];
    unique?: boolean;
};

export type Table = {
    name: string;
    fields: Array<Field>;
    indexes?: Array<Index>;
    inherits?: string;
    checks?: Array<string>;
};

export type Field = {
    name: string;
    type: string;
    default?: any;

    // Constraints
    primaryKey?: boolean;
    references?: {
        table: string;
        fields: Array<String>;
    };
    unique?: boolean;
    notNull?: boolean;
};
