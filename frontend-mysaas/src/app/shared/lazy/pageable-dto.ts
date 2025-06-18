export class PageableDto<T> {

    page?: number;
    size?: number;
    sortField?: string;
    sortOrder?: string;
    dto?: T

    constructor() { }

}