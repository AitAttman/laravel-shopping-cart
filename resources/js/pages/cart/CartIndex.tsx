import PublicLayout from '@/layouts/PublicLayout';
import ProductRow from '@/pages/cart/ProductRow';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CartItemRowType, ProductType, StateType } from '@/types/ait';
import Spinner from '@/components/ait/Spinner';
import Products from '@/routes/products';
import Cart from '@/routes/cart';
import product from '@/routes/product';
import products from '@/routes/products';
import cart from '@/routes/cart';
import cartsController from '@/actions/App/Http/Controllers/CartsController';
import MessageBox from '@/components/ait/MessageBox';
export default function CartIndex() {
    const page = usePage();
    const [currentPage, setCurrentPage] = useState<number>( page.props.meta?.page as number || 1);
    const [products, setProducts] = useState<CartItemRowType[]>((page.props.data as CartItemRowType[]) || []);
    const [state, setState] = useState<StateType>({loading: false, errorMessage: "", successMessage: ""})
    const [checkoutState, setCheckoutState] = useState<StateType>({loading: false, errorMessage: "", successMessage: ""})
    const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
    const loadMore = (pageNumber: number ) => {
        router.get(Cart.view().url , {
            page: pageNumber
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                const newProducts: CartItemRowType[] = (page.props.data as CartItemRowType[]) || [];
                if( newProducts.length > 0  ){
                    if( pageNumber === 1 ) {
                        setProducts(newProducts);
                    } else {
                        setProducts( prev=> [...prev, ...newProducts])
                    }
                } else if( page.props.message ) {
                    setState( p=> ({...p, errorMessage: page.props.message as string }))
                    setCanLoadMore( false )
                }
            },
            onError: (err) => {
                console.log(err);
            },
            onStart: ()=> {
                setState( p=> ({...p, loading: true, errorMessage: ""}))
            }
            ,
            onFinish: ()=> {
                setState( p=> ({...p, loading: false}))
            }
        })
    }
    const onDelete = (productId: number) => {
        setProducts( p => [...p.filter(product => product.product_id !== productId)])
    }
    const submitCheckout = ()=> {
        router.post( cart.checkout.submit(), {} , {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (p) => {
                setProducts([])
            },
            onError: (err) => {

            },
            onStart: () => {
                setCheckoutState( p=> ({...p, loading: true, errorMessage: "", successMessage: "" }))
            },
            onFinish: () => {
                setCheckoutState( p=> ({...p, loading: false }))
            }
        } )
    }
    return (
        <PublicLayout title="Cart items">
            <h1 className="p-3">Cart Items</h1>
            { !page.props.meta?.count &&
                <div className="flex w-full flex-col gap-2 items-center py-2">
                    <p>There are no items in your cart yet!</p>
                    <div>
                        <Link href={Products.public.index()} className="button button-primary">Browse Products</Link>
                    </div>
                </div>
            }
                <div className="grid grid-cols-1 gap-2 max-w-6xl mx-auto p-2 md:grid-cols-[auto_max(300px,30%)]">
                    <div className="flex flex-col gap-1">
                        {products.length >0 && products.map((p,index) => {
                            return <ProductRow key={index}
                                               product_id={p.product_id}
                                               qty={p.qty}
                                               name={p.name}
                                               price={p.price}
                                               url={p.url}
                                               onDelete={onDelete}

                            />
                        })}
                        <div className="flex flex-col gap-1 items-center">
                            {state.errorMessage && <p className="text-red-500">{state.errorMessage}</p>}
                            {state.loading && <Spinner />}
                            <div className="flex gap-2 my-2">
                                {page.props.meta?.count && currentPage > 1 && products.length <= 0 &&
                                        <button className="button button-success"
                                                onClick={() => {
                                                    setCurrentPage( 1 )
                                                    setCanLoadMore( true )
                                                    loadMore(1)
                                                }}
                                        >Back to first Page</button>
                                    }
                                    {!state.loading && canLoadMore && page.props.meta?.count && products.length >  0 &&
                                        <button className="button button-theme"
                                                onClick={() => {
                                                    setCurrentPage( p => p + 1 )
                                                    loadMore( currentPage + 1)
                                                }}
                                        >Load More</button>
                                    }
                            </div>
                        </div>
                    </div>
                    {page.props.meta?.count &&
                        <div className="flex flex-col gap-2">
                            <div className="text-center">
                                {checkoutState.loading && <Spinner />}
                                <MessageBox message={checkoutState.errorMessage} isError={true} visible={!!checkoutState.errorMessage} />
                                <MessageBox message={checkoutState.successMessage} isError={false} visible={!!checkoutState.successMessage} />
                                <button className="button-success button"
                                onClick={()=>{
                                    submitCheckout()
                                }}
                                >Finish order</button>
                            </div>
                        </div>
                    }
                </div>
        </PublicLayout>
    )
}

