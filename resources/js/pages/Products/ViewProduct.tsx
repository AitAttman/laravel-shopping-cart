import PublicLayout from '@/layouts/PublicLayout';
import { router, usePage } from '@inertiajs/react';
import Spinner from '@/components/ait/Spinner';
import Cart from '@/routes/cart';
import { useState } from 'react';
import Icon from '@/components/ait/Icon';
import { StateType } from '@/types/ait';
import MessageBox from '@/components/ait/MessageBox';

type CartItemArgs = {
    product_id: number;
    qty: number|string;
}
export default function viewProduct() {
    const {product, auth} = usePage().props;
    const [state, setState] = useState<StateType>({loading: false, errorMessage: "", successMessage: ""});
    const [qty, setQty] = useState<number|string>("");
    const isAuthenticated: boolean = !!auth?.user;
    const addItem = ()=> {
        router.post(Cart.add_item().url , {
            product_id: product?.id || 0,
            qty:qty || 1
        }, {
            preserveScroll: true,
            preserveState:true,
            onFlash: (flash) => {
                setState(p=> ({...p, successMessage: flash.message as string || ""}))
                setTimeout(() => {
                    setState(p=> ({...p, successMessage: ""}))
                }, 2000)
            },
            onError: (errors) => {
                setState(p=> ({...p, errorMessage: errors.message as string || ""}))
            },
            onStart: ()=> setState(p=> ({...p, loading: true, successMessage: "", errorMessage: "" })),
            onFinish: ()=> setState(p=> ({...p, loading: false })),
        })
    }
    return (
        <PublicLayout>
            <div className="grid max-md:grid-cols-1 min-md:grid-cols-[max(30%,300px)_auto] gap-2 p-2 max-w-[1024px] mx-auto">
                <div className="max-w-100 rounded-sm overflow-hidden mx-auto aspect-square overflow-hidden flex justify-center">
                    {product?.thumbnail_url &&
                        <img src={product?.thumbnail_url } className="object-cover object-center"/>
                    }
                </div>
                <div className="flex flex-col gap-2">
                    <h1>{product?.name || ""}</h1>
                    <div>
                        <span className="text-green-500 font-bold text-3xl">{product?.price || ""}</span>
                        <sup className="font-bold text-xl line-through ps-2">{product?.price_regular || ""}</sup>
                    </div>
                    {product.snippet && <p>{product.snippet}</p>}
                        <Spinner visible={state.loading}/>
                    <MessageBox message={state.errorMessage} isError={true} />
                    <MessageBox message={state.successMessage} isError={false} />
                    <p className={'font-bold '+(product?.stock_quantity ? 'text-green-500' :'text-red-500')}>{product?.stock_quantity ? 'Available' : 'Not Available'}</p>
                    {isAuthenticated && product?.stock_quantity > 0 &&
                        <div className="flex gap-2 items-center max-md:justify-center">
                            <input type="number" value={qty}
                                   onChange={ev => {
                                       setQty( Number(ev.target.value) || "");
                                   }}
                                   className="input max-w-50 py-1" placeholder="Qty"/>
                            <button className="button button-success flex align-items-center gap-2"
                                    onClick={addItem}
                            ><span>Add to cart</span><Icon icon="add-shopping-cart" fill="fill-white"/></button>
                        </div>
                    }
                    {
                        !isAuthenticated &&
                        <p className="text-red-500">To be able to add this product to your cart, you must login</p>
                    }
                </div>
            </div>
            <hr/>
            <div>
                <p>{product?.content || ""}</p>
            </div>
        </PublicLayout>
    )
}
