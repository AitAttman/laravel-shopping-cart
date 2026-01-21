export type ProductType = {
    id: number;
    name?: string;
    content?: string;
    slug?: string;
    snippet?: string;
    status?: number;
    price?: number;
    price_regular?: number;
    stock_quantity?: number;
    "thumbnail_url"?: string;
    "thumbnail_path"?: string;
    [key:string]:any;

}
export type CartItemRowType = {
    product_id: number;
    name: string;
    price: number;
    qty: number;
    url: string;
    thumbnail_url?: string;
    [key:string]:any;
}
export type StateType = {
    loading: boolean;
    successMessage: string;
    errorMessage: string;
    [key:string]: any;
}
export type AdminCartRowType = {
    id: number;
    status: number;
    status_label: string;
    user_name: string;
    user_id: number;
    items_count: number;
    sub_total: number;
    [key:string]: any;
}
export type AdminTransactionRowType = {
    id: number;
    status: number;
    status_label: string;
    type: number;
    type_label: string;
    user_name: string;
    [key:string]: any;
}
