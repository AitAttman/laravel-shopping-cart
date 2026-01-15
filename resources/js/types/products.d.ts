export interface Product {
    name?: string;
    content?: string;
    slug?: string;
    snippet?: string;
    price?: number;
    price_regular?: number;
    stock?: number;
    reserved_qty?: number;
    [key:string]:any;

}
