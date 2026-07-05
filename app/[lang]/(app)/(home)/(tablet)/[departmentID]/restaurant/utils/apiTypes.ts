interface Combo {
 key: string;
 value: string;
}

interface PagedData<T> {
 rowsCount: number;
 limit: number;
 offset: number;
 rows: T;
}

export type { Combo, PagedData };
