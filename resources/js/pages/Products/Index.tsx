import PublicLayout from '@/layouts/PublicLayout';
import ProductCard from '@/components/ait/ProductCard';
import { Product } from '@/types/products';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Products from '@/routes/products';
import Spinner from '@/components/ait/Spinner';

type IndexProps = {
    data?: Product[];
    meta?: {
        page?: number;
        limit?: number;
    };
        message?:string;
}
export default function Index(){
    const page = usePage<IndexProps>()
    const [products, setProducts] = useState<Product[]>(page.props.data || [] )
    const [loadBtnVisible, setLoadBtnVisibility] = useState<boolean>(true)
    const [currentPage, setCurrentPage] = useState<number>(page.props.meta?.page || 1 )
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const loadMore = ( page:number = 1) => {
        if( loading ) return;
        setMessage("")
        router.get(Products.public.index().url,
            {
                page: page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: false,
                onStart: ()=> {
                    setLoading( true )
                },
                onFinish: () => {
                    setLoading( false )
                },
                onSuccess: ( response ) => {
                    const newProducts: Product[] = (response.props.data as Product[] ) || []
                    if( newProducts.length > 0){
                        if( currentPage === 1 )
                            setProducts( newProducts )
                        else
                            setProducts(p=> ([...p, ...newProducts ]))
                        setLoadBtnVisibility( true )
                    } else {
                        setLoadBtnVisibility( false )
                        if( response.props.message ){
                            setMessage( response.props.message as string)
                        }
                    }
                },
                onError: ( error ) => {
                    console.log( error )
                }
            }
            )
    }
    return (
        <PublicLayout>
            <div className="grid p-2 grid-cols-4 gap-1 max-md:grid-cols-3 max-sm:grid-cols-2">
                {products.map((product: Product, index: number) => {
                    return (
                        <ProductCard
                            key={index}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            priceRegular={product.price_regular}
                            url={product.url || "#"}
                            thumbnailUrl="http://localhost:8000/images/products/2025/08/croisillon-emballage-gmgr.jpg"
                        />
                    )
                })}
            </div>
            <div className="flex flex-col gap-2 items-center my-2">
                {message &&
                    <p className="text-red-500">{message}</p>
                }
                <Spinner visible={loading}/>
                {!loading && loadBtnVisible && products.length > 1 &&
                    <button className="button button-primary"
                            onClick={()=> {
                                const next = currentPage + 1
                                setCurrentPage( next )
                                loadMore(next)
                            }}
                    >Load more</button>
                }
                    <button className="button button-primary"
                            onClick={() => {
                                setCurrentPage(1)
                                setProducts([])
                                loadMore()
                            }}
                    >Reset</button>
            </div>
        </PublicLayout>
    )
}
