export class Page<T> {

    content?: Array<T>;
    last?: boolean;
    totalElements?: number;
    totalPages?: number;
    size?: number;

    constructor() { }

}