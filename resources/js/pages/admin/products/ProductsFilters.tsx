import { ActionDispatch, Dispatch, SetStateAction, useRef, useState } from 'react';

export type ProductFiltersType = {
    orderBy: string;
    order: string;
    search: string;
    status: number;
}
type ProductsFiltersArgs = {
    filters: ProductFiltersType;
    setFilters: Dispatch<SetStateAction<ProductFiltersType>>;
}
export default function ProductsFilters({filters, setFilters }:ProductsFiltersArgs){
    const searchTimeoutId = useRef<number|null>(null)
    const [searchText, setSearchText] = useState<string>('')
    return (
        <div className="flex flex-col gap-1 p-2">
            <input type="text" placeholder="search..." className="input max-w-200 mx-auto"
                   onChange={ev => {
                       const value = ev.target.value;
                       setSearchText( value )
                       if( searchTimeoutId.current )
                           clearTimeout( searchTimeoutId.current )
                       searchTimeoutId.current = setTimeout( () => {
                           setFilters( p=> ({...p, search: value }) )
                       }, 1000 )
                   }}
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="flex gap-1 text-nowrap">
                    <label htmlFor="orderby">Sort By</label>
                    <select name="na" id="orderby" className="input"
                    onChange={ev => setFilters( p=> ({...p, orderBy: ev.target.value }) ) }
                    >
                        <option value="id">ID</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="created_at">Created At</option>
                    </select>
                </div>
                <div className="flex gap-1 text-nowrap">
                    <select name="order" className="input"
                            onChange={ev => setFilters( p=> ({...p, order: ev.target.value }) ) }
                    >
                        <option value="desc">Newer First</option>
                        <option value="asc">Older First</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
