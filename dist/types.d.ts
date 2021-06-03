export declare type TableProps = {
    name: string;
    fields: Array<FieldProps<any>>;
};
export declare type FieldProps<T> = {
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
