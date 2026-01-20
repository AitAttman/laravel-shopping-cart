import PublicLayout from '@/layouts/PublicLayout';
import { useForm, usePage } from '@inertiajs/react';
import Spinner from '@/components/ait/Spinner';
import Products from '@/routes/products';
import Product from '@/routes/product';
import Cart from '@/routes/cart';
import { useEffect, useState } from 'react';
import Icon from '@/components/ait/Icon';

type CartItemArgs = {
    product_id: number;
    qty: number|string;
}
export default function viewProduct() {
    const page = usePage();
    const {data, setData, processing, post, hasErrors, errors } = useForm<CartItemArgs>({product_id: page.props.product?.id || 0 , qty: 1 });
    const [success, setSuccess] = useState<string>("");
    const isAuthenticated: boolean = !!page.props.auth?.user;
    const addItem  = () => {
        post( Cart.add_item().url , {
            preserveScroll: true,
            data: data,
            onSuccess: (p) => {
                setSuccess( (p.props.flash?.message as string)  || "")
                setTimeout(()=>{
                    setSuccess("")
                }, 3000)
            }
        })
    }
    return (
        <PublicLayout>
            <div className="grid max-md:grid-cols-1 min-md:grid-cols-[max(30%,300px)_auto] gap-2 p-2 max-w-[1024px] mx-auto">
                <div className="max-w-100 rounded-sm overflow-hidden mx-auto aspect-square overflow-hidden flex flex-col align-items-center justify-center">
                    {page.props.product?.thumbnail_url &&
                        <img src={page.props.product?.thumbnail_url }/>
                    }
                </div>
                <div className="flex flex-col gap-2">
                    <h1>{page.props.product?.name || ""}</h1>
                    <div>
                        <span className="text-green-500 font-bold text-3xl">{page.props.product?.price || ""}</span>
                        <sup className="font-bold text-xl line-through ps-2">{page.props.product?.price_regular || ""}</sup>
                    </div>
                    {page.props.product.snippet && <p>{page.props.product.snippet}</p>}
                        <Spinner visible={processing}/>
                    {hasErrors &&
                        <p className="text-red-500 p-1">{errors?.message || ""}</p>
                    }
                    {success &&
                        <p className="text-green-500 p-1">{success}</p>
                    }
                    {isAuthenticated &&
                        <div className="flex gap-2 items-center max-md:justify-center">
                            <input type="number" value={data.qty}
                                   onChange={ev => {
                                       setData(p=>({...p, qty: Number(ev.target.value) || "" }));
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
                <p>{page.props.product?.content || ""}</p>
            </div>
        </PublicLayout>
    )
}
