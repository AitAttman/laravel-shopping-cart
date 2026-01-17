export type ProductType = {
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
export type CartItemRowType = {
    product_id: number;
    name: string;
    price: number;
    qty: number;
    url: string;
    [key:string]:any;
}
export type StateType = {
    loading: boolean;
    successMessage: string;
    errorMessage: string;
}
