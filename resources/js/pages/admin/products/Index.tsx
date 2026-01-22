import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {default as productsRoutes } from '@/routes/products';
import Icon from '@/components/ait/Icon'
import { useEffect, useState } from 'react';
import { ProductType, StateType } from '@/types/ait';
import { adminIndex } from '@/actions/App/Http/Controllers/ProductsController';
import Spinner from '@/components/ait/Spinner';
import MessageBox from '@/components/ait/MessageBox';
import ProductsFilters, { ProductFiltersType } from '@/pages/admin/products/ProductsFilters';
import AdminProductRow from '@/pages/admin/products/AdminProductRow';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';

export default function Index(){
    const page = usePage();
    const [products, setProducts] = useState<ProductType[]>(page.props.data as [] || []);
    const [state, setState] = useState<StateType>({loading: false, successMessage: "",errorMessage: "", canLoadMore: !!page.props.data});
    const [currentPage, setCurrentPage] = useState<number>( page.props.meta?.page || 1);
    const [filters, setFilters] = useState<ProductFiltersType>({
        order: "desc",
        orderBy: "id",
        search: "",
        status: 0,
    });
    const loadmore = (pageNumber: number) => {
        router.get(adminIndex(),{
            page: pageNumber,
            order: filters.order,
            orderBy: filters.orderBy,
            search: filters.search,
            status: filters.status,
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
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Products',
            href: productsRoutes.index().url,
        },
    ];
    useEffect(() => {
        setCurrentPage( 1 )
        loadmore( 1 )
    }, [filters]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex gap-2 px-2">
                <button className="button button-theme"
                        onClick={() => {
                            setFilters( p=> ({...p, status: 0, search: ""}))
                        }}>All Products</button>
                <Link href="/admin/products/new" className="button button-theme">New Product</Link>
                <button className="button button-theme"
                onClick={() => {
                    setFilters( p=> ({...p, status: 2}))
                }}>Trash</button>
            </div>
            <ProductsFilters filters={filters} setFilters={setFilters}/>
            <div className="table-responsive p-1">
                <table className="table-auto w-full table table-hover text-start theme-bg-1 p-2 border">
                    <thead>
                    <tr>
                        <th className="text-end text-end max-w-20" colSpan={2}>ID</th>
                        <th className="min-w-10 text-start">Name</th>
                        <th className="max-15 text-center">Status</th>
                        <th className="max-w-15 text-end">Price</th>
                        <th className="max-w-15 text-end">Stock</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(p => {
                        return (
                            <AdminProductRow product={p} key={p.id} />
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
