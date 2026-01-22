import Spinner from '@/components/ait/Spinner';
import { JSX, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import CartsController from '@/actions/App/Http/Controllers/CartsController';
import Icon from '@/components/ait/Icon';

interface ProductCardProps {
    id?: number;
    thumbnailUrl?: string;
    name?: string;
    price?: number|string;
    priceRegular?: number|string;
    url?:string;
    key?:number
    [k:string]: any;
}
interface ConfigType{
    product_id?: number;
    qty?:number;
    message?:string;
    url?:string;
    [k:string]: any;
}
export default function ProductCard({id=0, thumbnailUrl="",url = '#', name="", price="", priceRegular=""}: ProductCardProps): JSX.Element {
    const page = usePage();
    const isAuthenticated : boolean = !!page.props.auth?.user
    const {post, processing, errors, hasErrors, setData } = useForm<ConfigType>('post' , '', {product_id: id, qty: 1})
    const [successMessage, setSuccessMessage] = useState<string>("");
    const addItem = () => {
        post( CartsController.addItem().url , {
            onFlash: (flash) => {
                setSuccessMessage((flash.message as string  ) ||"" )
                setTimeout(()=>setSuccessMessage(""), 3000 )
            },
            preserveScroll:true,
            preserveState:true,
        } )
    }
    return (
        <div className="p-2 rounded-s flex flex-col theme-bg-1">
            <div className="rounded-sm overflow-hidden">
                <Link href={url} className="w-full h-full">
                    <img src={thumbnailUrl} />
                </Link>
            </div>
            <div>
                <Link href={url} className="md:text-xl">{name}</Link>
            </div>
            <div className="flex gap-2 items-top">
                <span className="text-xl">{price}</span>
                <span className="text-sm line-through">{priceRegular}</span>
            </div>
            {isAuthenticated &&
                <>
                    <div className="flex flex-1 justify-center flex-col gap-1 items-center">
                        {hasErrors &&
                            <p className="text-red-500 text-center py-2">{errors.message || ""}</p>
                        }
                        {successMessage &&
                            <p className="text-green-500 text-center py-2">{successMessage}</p>
                        }
                        <Spinner visible={processing}/>
                    </div>
                    <div className="flex justify-center">
                        <button className="button button-success flex align-items-center gap-2"
                                onClick={addItem}
                        ><span>Add to cart</span><Icon icon="add-shopping-cart" fill="fill-white"/></button>
                    </div>
                </>
            }
        </div>
    )
}
