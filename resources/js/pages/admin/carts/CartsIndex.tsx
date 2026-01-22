import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AdminCartRowType, StateType } from '@/types/ait';
import MessageBox from '@/components/ait/MessageBox';
import adminCartsController from '@/actions/App/Http/Controllers/AdminCartsController';
import CartRow from '@/pages/admin/carts/CartRow';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';

export default function CartsIndex() {
    const page = usePage()
    const [carts, setCarts] = useState<AdminCartRowType[]>(page.props.data as AdminCartRowType[] || []);
    const [currentPage, setCurrentPage] = useState<number>(page.props.meta?.page || 1);
    const [state,setState] = useState<StateType>({loading:false, errorMessage: "", successMessage: ""});

    const loadMore = ( nextPage : number = 1 )=> {
        router.get(adminCartsController.cartsIndex(), {
            page: nextPage
        },{
            preserveScroll: true,
            preserveState: true,
            onStart:()=>setState( p=> ({...p, loading: true, successMessage: "", errorMessage: ""})),
            onFinish: ()=>setState( p=> ({...p, loading: false})),
            onError:(errors) => setState( p=> ({...p, errorMessage: errors.message || ""})),
            onSuccess: (res) => {
                const newCarts :AdminCartRowType[] = res.props.data && Array.isArray( res.props.data ) ? res.props.data as AdminCartRowType[] : []
                if(newCarts.length > 0){
                    if( nextPage === 1 )
                        setCarts(newCarts);
                    else
                        setCarts( p=> [...p, ...newCarts ]);
                } else if(nextPage === 1 ){
                    setState( p=> ({...p, errorMessage: "No carts found."}));
                } else {
                    setState( p=> ({...p, errorMessage: "No more carts found."}));
                }
            }
        })
    }
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Carts',
            href: admin.carts.index().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Carts index" />
            {carts.length > 0 &&
                <div className="table-responsive p-1">
                    <table className="table-auto w-full table table-hover text-start theme-bg-1 p-2 border">
                        <tbody>
                        <tr className="text-nowrap">
                            <th className="text-start">ID</th>
                            <th className="text-start">Num. Items</th>
                            <th className="text-start">Sub-Total</th>
                            <th className="text-start">Status</th>
                            <th className="text-start">User Name</th>
                            <th className="text-start">Action</th>
                        </tr>
                        {carts.map((cart: AdminCartRowType) =>{
                            return (
                                <CartRow cart={cart} key={cart.id} setCarts={setCarts}/>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            }
            <div className="flex flex-col gap-1 items-center">
                <MessageBox message={state.errorMessage || page.props.message as string || ""} isError={true} />
                <MessageBox message={state.successMessage || ""} isError={false} />
                {currentPage > 1 && page.props.meta?.count && !page.props.data?.length  &&
                    <div>
                        <button className="button button-primary"
                                onClick={() => {
                                    setCurrentPage( ()=> {
                                        loadMore(1);
                                        return 1
                                    })
                                }}
                        >First Page</button>
                    </div>
                }
                {!state.loading && page.props.data && page.props.data.length > 0 &&
                    <div>
                        <button className="button button-primary"
                                onClick={() => {
                                    setCurrentPage( p=> {
                                        const next = p+1
                                        loadMore(next);
                                        return next
                                    })
                                }}
                        >Load more</button>
                    </div>
                }
            </div>
        </AppLayout>
    )
}
