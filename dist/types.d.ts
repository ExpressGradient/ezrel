export declare type Schema = {
    tables: Array<Table>;
    databaseString: string;
    schemaFilePath?: string;
};
export declare type Table = {
    name: string;
    fields: Array<Field>;
};
export declare type Field = {
    name: string;
    type: string;
    default?: any;
    primaryKey?: boolean;
    references?: {
        table: string;
        field: string;
    };
    unique?: boolean;
    notNull?: boolean;
};
