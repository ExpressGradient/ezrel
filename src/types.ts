export type Schema = {
    tables: Array<Table>;
    databaseString: string;
    schemaFilePath?: string;
};

export type Table = {
    name: string;
    fields: Array<Field>;
};

export type Field = {
    name: string;
    type: string;
    default?: any;

    // Constraints
    primaryKey?: boolean;
    references?: {
        table: string;
        field: string;
    };
    unique?: boolean;
    notNull?: boolean;
};
