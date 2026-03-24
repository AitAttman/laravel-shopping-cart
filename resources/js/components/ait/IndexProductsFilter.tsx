import { ProductsIndexContext } from "@/pages/Products/Index";
import { useContext } from "react";
import ToggleSwitch from "./ToggleSwitch";

/**
 * Display products filters
 */
export default function IndexProductsFilters(){
    const context = useContext(ProductsIndexContext)
    return (
        <div className="flex justify-between p-2">
            <div></div>
            <ToggleSwitch label="Latest First" id="latest-procuts" checked={context?.filters.order === 'desc'} onChange={(ev) => {
                context?.setFilters( p => ({...p, order: ev.target.checked ? 'desc': 'asc'}))
            }}/>
        </div>
    )
}
