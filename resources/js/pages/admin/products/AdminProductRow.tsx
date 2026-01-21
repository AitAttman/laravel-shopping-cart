import { Link, router, usePage } from '@inertiajs/react';
import product from '@/routes/product';
import Icon from '@/components/ait/Icon';
import { ProductType, StateType } from '@/types/ait';
import { useState } from 'react';
import Spinner from '@/components/ait/Spinner';
import MessageBox from '@/components/ait/MessageBox';

type AdminProductRowType = {
    product: ProductType;
}
export default function AdminProductRow({product: p}:AdminProductRowType){
    const page = usePage();
    const [state, setState] = useState<StateType>({loading: false, successMessage: "", errorMessage: ""});
    const moveToTrash  = () => {
        router.post(product.to_trash({productId: p.id }),{},{
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                setState( p=> ({...p, errorMessage: errors.message as string || ""}))
            },
            onSuccess: (page) => {
                setState( p=> ({...p, successMessage: page.props.flash?.message as string || ""}))
                setTimeout(() => {
                    setState( p=> ({...p, successMessage: "" }))
                },2000 )
            },
            onStart: () => setState(p=> ({...p, loading: true, errorMessage: "", successMessage: ""})),
            onFinish: () => setState(p=> ({...p, loading: false}))
        })
    }
    return (
        <tr>
            <td className="max-w-30 min-w-10">
                <div className="aspect-square md:max-w-30 max-w-25 min-w-25 overflow-hidden">
                    {p.thumbnail_url && <img src={p.thumbnail_url}/> }
                </div>
            </td>
            <td className="max-w-10 text-end">{p.id}</td>
            <td><div>
                <p>{p.name}</p>
                <MessageBox message={state.errorMessage} isError={true}/>
                <MessageBox message={state.successMessage} isError={false}/>
                <Spinner visible={state.loading}/>
                <div className="flex gap-1 mt-1">
                    <Link href={product.edit({productId: p.id}).url } className="button button-theme"><Icon icon="edit" /></Link>
                    <Link href={product.view({slug:p.slug || "#"})} className="button button-theme"><Icon icon="visibility" /></Link>
                    <button className="button button-theme" title="move to trash"
                    onClick={() => moveToTrash()}
                    ><Icon icon="delete"/></button>
                </div>
            </div></td>
            <td className="max-w-10 center">{p.status}</td>
            <td className="max-w-10 text-end">{p.price}</td>
            <td className="max-w-10 text-end">{p.stock_quantity}</td>
        </tr>
    )
}
