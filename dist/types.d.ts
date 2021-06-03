export declare type Schema = {
    tables: Array<Table>;
    databaseString: string;
    schemaFilePath?: string;
};
export declare type Table = {
    name: string;
    fields: Array<Field<any>>;
};
export declare type Field<T> = {
    name: string;
    type: string;
    default?: T;
    primaryKey?: boolean;
    references?: {
        table: string;
        field: string;
    };
    unique?: boolean;
    notNull?: boolean;
};
