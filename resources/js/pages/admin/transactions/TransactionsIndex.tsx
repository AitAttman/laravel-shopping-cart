import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AdminTransactionRowType, StateType } from '@/types/ait';
import MessageBox from '@/components/ait/MessageBox';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import TransactionRow from '@/pages/admin/transactions/TransactionRow';

export default function TransactionsIndex() {
    const page = usePage()
    const [trs, setTrs] = useState<AdminTransactionRowType[]>(page.props.data as AdminTransactionRowType[] || []);
    const [currentPage, setCurrentPage] = useState<number>(page.props.meta?.page || 1);
    const [state,setState] = useState<StateType>({loading:false, errorMessage: "", successMessage: ""});

    const loadMore = ( nextPage : number = 1 )=> {
        router.get(admin.transactions.index(), {
            page: nextPage
        },{
            preserveScroll: true,
            preserveState: true,
            onStart:()=>setState( p=> ({...p, loading: true, successMessage: "", errorMessage: ""})),
            onFinish: ()=>setState( p=> ({...p, loading: false})),
            onError:(errors) => setState( p=> ({...p, errorMessage: errors.message || ""})),
            onSuccess: (res) => {
                const newCarts :AdminTransactionRowType[] = res.props.data && Array.isArray( res.props.data ) ? res.props.data as AdminTransactionRowType[] : []
                if(newCarts.length > 0){
                    if( nextPage === 1 )
                        setTrs(newCarts);
                    else
                        setTrs( p=> [...p, ...newCarts ]);
                } else if(nextPage === 1 ){
                    setState( p=> ({...p, errorMessage: "No items found."}));
                } else {
                    setState( p=> ({...p, errorMessage: "No more items found."}));
                }
            }
        })
    }
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products Transactions',
            href: admin.transactions.index().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Carts index" />
            <div className="p-2 flex gap-1">
                <Link href="#" className="button button-primary">New Transaction</Link>
                <Link href="#" className="button button-primary">Orders</Link>
                <Link href="#" className="button button-primary">Purchases</Link>
            </div>
            {trs.length > 0 &&
                <div className="table-responsive p-1">
                    <table className="table-auto w-full table table-hover text-start theme-bg-1 p-2 border">
                        <tbody>
                        <tr className="text-nowrap">
                            <th className="text-start">ID</th>
                            <th className="text-start">Type</th>
                            <th className="text-start">Status</th>
                            <th className="text-start">User Name</th>
                            <th className="text-start">Date</th>
                            <th className="text-start">Action</th>
                        </tr>
                        {trs.map((tr: AdminTransactionRowType) =>{
                            return (
                                <TransactionRow tr={tr} key={tr.id} setTrs={setTrs} />
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
