import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import product from '@/routes/product';
import Icon from '@/components/ait/Icon'
import { useEffect, useState } from 'react';
import { ProductType, StateType } from '@/types/ait';
import { adminIndex } from '@/actions/App/Http/Controllers/ProductsController';
import Spinner from '@/components/ait/Spinner';
import MessageBox from '@/components/ait/MessageBox';

export default function Index(){
    const page = usePage();
    const [products, setProducts] = useState<ProductType[]>(page.props.data as [] || []);
    const [state, setState] = useState<StateType>({loading: false, successMessage: "",errorMessage: "", canLoadMore: !!page.props.data});
    const [currentPage, setCurrentPage] = useState<number>( page.props.meta?.page || 1);
    const loadmore = (pageNumber: number) => {
        router.get(adminIndex(),{
            page: pageNumber,
        },{
            preserveScroll: true,
            preserveState: true,
            onStart: ()=> setState( p=> ({...p, loading: true })),
            onFinish: ()=> setState( p=> ({...p, loading: false })),
            onSuccess: (page) => {
                const data = page.props.data as ProductType[];
                if( data && data.length > 0 ){
                     if( pageNumber === 1 )
                         setProducts( data )
                    else
                        setProducts(p=> [...p, ...data])
                    setState( p=> ({...p, canLoadMore: true }))
                } else {
                    setState( p=> ({...p, canLoadMore: false }))
                }
            }
        })
    }
    useEffect(() => {
        console.log( products )
    }, []);
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <Link href="/admin/products/new" className="button button-primary">New Product</Link>
            <div className="flex flex-col gap-1 p-2">
                <input type="text" placeholder="search..." className="input max-w-200 mx-auto"/>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="flex gap-1 text-nowrap">
                        <label htmlFor="orderby">Sort By</label>
                        <select name="na" id="orderby" className="input">
                            <option value="id">ID</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="created_at">Created At</option>
                        </select>
                    </div>
                    <div className="flex gap-1 text-nowrap">
                        <select name="order" className="input">
                            <option value="desc">Newer First</option>
                            <option value="asc">Older First</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table-auto w-full table table-hover text-start">
                    <thead>
                    <tr>
                        <th className="text-end text-end max-w-20" colSpan={2}>ID</th>
                        <th className="min-w-10 text-start">Name</th>
                        <th className="max-w-15 text-end">Price</th>
                        <th className="max-w-15 text-end">Stock</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(p => {
                        return (
                            <tr key={p.id}>
                                <td className="max-w-30 min-w-10">
                                    <div className="aspect-square md:max-w-30 max-w-25 min-w-25 overflow-hidden">
                                        <img src="http://localhost:8000/images/products/2025/08/iwke-ewek-1.jpg"/>
                                    </div>
                                </td>
                                <td className="max-w-10 text-end">4</td>
                                <td><div>
                                    <p>{p.name}</p>
                                    <div className="flex gap-1 mt-1">
                                        <Link href={product.edit({productId: p.id}).url } className="button button-theme"><Icon icon="edit" /></Link>
                                        <Link href={product.view({slug:p.slug || "#"})} className="button button-theme"><Icon icon="visibility" /></Link>
                                    </div>
                                </div></td>
                                <td className="max-w-10 text-end">{p.price}</td>
                                <td className="max-w-10 text-end">{p.stock}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
            <div className="py-2 flex flex-col items-center gap-1">
                {page.props.message &&
                    <MessageBox message={page.props.message as string} isError={true} />
                }
                <Spinner visible={state.loading} />
                {!state.loading && state.canLoadMore &&
                    <button
                        onClick={()=>{
                            setCurrentPage( p=> {
                                const next = p + 1
                                loadmore( next )
                                return next;
                            })
                        }}
                        className="button button-primary">Load more</button>
                }
            </div>
        </AppLayout>
    )
}
