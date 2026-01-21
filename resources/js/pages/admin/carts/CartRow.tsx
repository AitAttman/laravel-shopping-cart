import { AdminCartRowType, StateType } from '@/types/ait';
import { router } from '@inertiajs/react';
import carts from '@/routes/admin/carts';
import { Dispatch, SetStateAction, useState } from 'react';
import MessageBox from '@/components/ait/MessageBox';
import Spinner from '@/components/ait/Spinner';

export default function CartRow({cart, setCarts = null }: {cart: AdminCartRowType, key:number, setCarts: Dispatch<SetStateAction<AdminCartRowType[]>>|null}) {
    const [state, setState] = useState<StateType>({loading: false, successMessage: "", errorMessage: "" });
    const destroyCart = ()=> {
        if( !confirm("Are you sure to delete this cart permanently ?"))
            return;
        router.delete(carts.destroy_cart({cartId:cart.id}) , {
            preserveState: true,
            preserveScroll: true,
            onError: (errors) => {
                setState( p=> ({...p, errorMessage: errors.message || ""}))
            },
            onStart: () => setState(p=> ({...p, loading: true, successMessage: "",errorMessage: "" })),
            onFinish: () => setState(p=> ({...p, loading: false })),
            onFlash: (flash) => {
                setState(p=> ({...p, successMessage: flash.message as string || "" }));
                setTimeout(()=> {
                    setState(p=> ({...p, successMessage: "" }));
                    if( setCarts )
                        setCarts( p => p.filter( item => item.id !== cart.id ) );
                }, 2000)
            }
        });
    }
    const makeOrder = () => {
        router.post( carts.make_order({cartId: cart.id}) , {}, {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                setState( p=> ({...p, errorMessage: errors.message || ""}))
            },
            onStart: () => setState(p=> ({...p, loading: true, successMessage: "",errorMessage: "" })),
            onFinish: () => setState(p=> ({...p, loading: false })),
            onFlash: (flash) => {
                setState(p=> ({...p, successMessage: flash.message as string || "" }));
                setTimeout(()=> {
                    setState(p=> ({...p, successMessage: "" }));
                    if( setCarts )
                        setCarts( p => p.filter( item => item.id !== cart.id ) );
                }, 2000)
            }
        })
    }
    return (<tr>
        <td>{cart.id}</td>
        <td>{cart.items_count}</td>
        <td>{cart.sub_total}</td>
        <td><span className={`text-white p-1 rounded ` + (cart.status === 1 ? 'bg-red-500': "bg-gray-600")}>{cart.status_label}</span></td>
        <td>{cart.user_name}</td>
        <td>
            <div className="flex flex-col">
                <Spinner visible={state.loading}/>
                <MessageBox message={state.successMessage} isError={false} />
                <MessageBox message={state.errorMessage} isError={true} />
                <div className="flex gap-1">
                <button className="button button-primary text-nowrap" title="make order"
                onClick={()=> makeOrder() }
                >Make Order</button>
                <button className="button button-danger"
                onClick={()=> destroyCart() }
                >Remove</button>
                </div>
            </div>
        </td>
    </tr>)
}
