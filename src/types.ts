export type Schema = {
    tables: Array<Table>;
    databaseString: string;
    schemaFilePath?: string;
};

export type Table = {
    name: string;
    fields: Array<Field<any>>;
};

export type Field<T> = {
    name: string;
    type: string;
    default?: T;

    // Constraints
    primaryKey?: boolean;
    references?: {
        table: string;
        field: string;
    };
    unique?: boolean;
    notNull?: boolean;
};
