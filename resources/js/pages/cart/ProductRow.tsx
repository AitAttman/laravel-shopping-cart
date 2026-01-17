import Icon from "@/components/ait/Icon"
import Spinner from '@/components/ait/Spinner';
import { ChangeEvent, useRef, useState } from 'react';
import { CartItemRowType, ProductType, StateType } from '@/types/ait';
import { Link, router, useForm } from '@inertiajs/react';
import Cart from '@/routes/cart';
import { deleteItem } from '@/actions/App/Http/Controllers/CartsController';
export default function ProductRow({
    product_id,
    name,
    price,
    qty,
    url,
    onDelete = null
                                   }: CartItemRowType & {
    onDelete?: (productId: number ) => void;
}) {
    const [product, setProduct] = useState<ProductType>();
    const [currentQty, setCurrentQty] = useState<number|string>( qty );
    const [state, setState] = useState<StateType>({loading: false, successMessage: "", errorMessage: ""});
    const timeoutId = useRef<number|null>( null );
    const updateItem = (theQty: number ) => {
        if( timeoutId.current )
            clearTimeout( timeoutId.current );
        timeoutId.current = setTimeout(()=>{
            router.post(Cart.add_item().url,{
                product_id: product_id,
                qty: theQty,
                },{
                preserveScroll: true,
                preserveState: true,
                onSuccess: (res) => {
                    setState( p=> ({...p, successMessage: (res.props.flash?.message as string) || ""}))
                    setTimeout(()=> {
                        setState( p=> ({...p , successMessage: ""}))
                    }, 3000)
                },
                onError: (err) => {
                    setState( p=> ({...p, errorMessage: err.message || ""}))
                },
                onStart: () => setState( p => ({...p, loading: true, successMessage: "", errorMessage: "" })),
                onFinish: () => setState( p => ({...p, loading: false })),
            })
        }, 2000 )
    }
    const removeItem = () => {
        router.delete(Cart.delete_item().url,{
            preserveScroll: true,
            preserveState: true,
            data: {product_id: product_id},
            onSuccess: (res) => {
                setState( p=> ({...p, successMessage:( res.props.flash?.message  as string)|| "" }))
                if( onDelete && typeof onDelete === "function" )
                    setTimeout( () => {
                        setState( p=> ({...p, successMessage: "" }))
                        onDelete( product_id )
                    }, 3000 )
            },
            onError: (err) => {
                setState( p=> ({...p, errorMessage: err.message || ""}))
            },
            onStart: () => setState( p => ({...p, loading: true, successMessage: "", errorMessage: "" })),
            onFinish: () => setState( p => ({...p, loading: false })),
        })
    }
    const updateQty = (value: number ) => {
        if( value < 0 ) value = 0
        setCurrentQty( value || "")
        updateItem(value || 1)
    }
    return (
        <div className="grid gap-2 grid-cols-[100px_auto_40px] theme-bg-1 p-1 rounded">
            <div className="aspect-square bg-red-300 overflow-hidden rounded">
                <Link href={url || ""} className="w-full h-full"><img src="/assets/images/car-tire.webp" alt={name}/></Link>
            </div>
            <div className="flex flex-col gap-2">
                <div><Link href={url || '#'}>{name}</Link></div>
                {state.errorMessage &&
                    <p className="text-red-500">{state.errorMessage}</p>
                }
                {state.successMessage &&
                    <p className="text-green-500">{state.successMessage}</p>
                }
                {state.loading && <Spinner />}
            </div>
            <div className="flex flex-col gap-1 items-center">
                <button className="button button-transparent"
                        onClick={ () => removeItem() }
                >
                    <Icon icon="delete" fill="fill-red-500" size={28}/>
                </button>
            </div>
            <div className="flex gap-1 items-center justify-between col-span-3">
                <div className="flex gap-2 items-center">
                    <button className="button button-theme"
                            onClick={() => updateQty( currentQty - 1 )}
                    >-</button>
                    <input type="number" value={currentQty}
                           onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                               updateQty( Number(ev.target.value) || 0 )
                           }}
                           placeholder="qty" className="input py-1 max-w-20"/>
                    <button className="button button-theme"
                            onClick={() => updateQty( currentQty + 1 )}
                    >+</button>
                    <div className="flex gap-1"><span>x</span><b>{price}</b></div>
                </div>
                <div className="px-2"><b>{Number(price * currentQty).toFixed(2)}</b></div>
            </div>
        </div>
    )
}
