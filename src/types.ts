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
