export type TableProps = {
    name: string;
    fields: Array<FieldProps<any>>
}

export type FieldProps<T> = {
    name: string;
    type: string;
    default?: T;

    // Constraints
    primaryKey?: boolean;
    references?: {
        table: string;
        field: string;
    }
    unique?: boolean;
    notNull?: boolean;
}
