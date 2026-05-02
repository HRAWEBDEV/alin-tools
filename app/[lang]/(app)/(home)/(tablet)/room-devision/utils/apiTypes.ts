interface CrudAccess {
 add: boolean;
 edit: boolean;
 delete: boolean;
}

interface Combo {
 key: string;
 value: string;
}
type Paging = {
 limit: number;
 offset: number;
};

type PagedData<T> = {
 rowsCount: number;
 rows: T;
} & Paging;

export type { Combo, PagedData, Paging, CrudAccess };
