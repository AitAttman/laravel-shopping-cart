import PublicLayout from '@/layouts/PublicLayout';
import { Link, router, usePage } from '@inertiajs/react';
import MessageBox from '@/components/ait/MessageBox';
import Spinner from '@/components/ait/Spinner';
import products from '@/routes/products';
import checkout from '@/routes/checkout';
import { useEffect, useState } from 'react';
import { StateType } from '@/types/ait';

export default function checkoutPage() {
    const page = usePage();
    const [state, setState] = useState<StateType>({loading: false, successMessage: "", errorMessage: ""})
    const submit = () => {
        router.post(checkout.post() ,{}, {
            preserveScroll: true,
            preserveState: true,
            onStart: () => setState( p=> ({...p, loading: true })),
            onFinish: () => setState( p=> ({...p, loading: false })),
        })
    }
    return (
        <PublicLayout title="Checkout">
            <div className="text-center pt-2"><h1>Checkout</h1></div>
            <div className="flex flex-col gap-2 items-center py-2">
                {page.props.flash?.message &&
                    <MessageBox message={page.props.flash.message as string} visible={true} isError={false} className="text-2xl"/>
                }
                {page.props.errors?.message &&
                    <MessageBox message={page.props.errors.message as string} isError={true} className="text-2xl"/>
                }
                {!page.props.data?.items_count && !page.props.flash?.message &&
                        <MessageBox message="Your cart is empty!" isError={true} className="text-2xl"/>
                }
                {!page.props.data?.items_count &&
                    <Link href={products.public.index()} className="button button-primary">Browse our products</Link>
                }
            </div>
            {page.props.data?.items_count &&
                <div className="flex flex-col gap-2 max-w-[95%] xl:max-w-3xl mx-auto my-2 theme-bg-1 p-2 border border-gray-300">
                    <div className="flex justify-between">
                        <span>Number of items</span>
                        <span>{page.props.data?.items_count || ""}</span>
                    </div>
                    <hr/>
                    <div className="flex justify-between">
                        <span>Sub-Total</span>
                        <span>$ {page.props.data?.sub_total}</span>
                    </div>
                    <hr/>
                    <div className="flex items-center flex-col">
                        <Spinner visible={state.loading}/>
                        <button className="button button-success"
                                onClick={() => submit()}
                        >Finish my order</button>
                    </div>
                </div>
            }
        </PublicLayout>
    )
}
