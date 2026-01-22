import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { ProductType, StateType } from '@/types/ait';
import Spinner from '@/components/ait/Spinner';
import MessageBox from '@/components/ait/MessageBox';
import productRoute from '@/routes/product';
import Products from '@/routes/products';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type Product = {
    price?: number;
    price_regular?: number;
    content?: string;
    name?: string;
    [key: string]: any;
}
type PlainObject = {
    [key: string]: any;
}
export default function EditProduct() {
    const page = usePage();
    const {
        data: product,
        setData: setProduct,
        post,
        progress
    } = useForm<ProductType>(page.props.data as ProductType || {} as ProductType);
    const [state, setState] = useState<StateType>({ loading: false, errorMessage: '', successMessage: '' });
    const formData = useRef<FormData>(new FormData() as FormData);
    const onSubmit = () => {
        post(productRoute.update({ productId: product.id || '' }).url, {
            preserveState: true,
            preserveScroll: true,
            onBefore: () => {
                setProduct(p => ({ ...p, status: Number(p.status || 0) }));
            },
            onStart: () => {
                setState(p => ({ ...p, loading: true, successMessage: '', errorMessage: '' }));
            },
            onFinish: () => {
                console.log(formData.current.entries());
                setState(p => ({ ...p, loading: false }));
            },
            onSuccess: (page) => {
                const pr = page.flash.data || null;
                if (pr?.id) {
                    setTimeout(() => {
                        router.visit(Products.index());
                    }, 2000);
                }
            }
        });
    };
    const fileToDataUrl = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Products',
            href: Products.index().url,
        },
        {
            title: product?.id ? 'Update product':'New Product',
            href: Products.edit().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {page.props.errors.message &&
                <MessageBox message={page.props.errors.message} isError={true} />}
            <div className="grid md:max-w-3xl mx-auto grid-cols-2 gap-2 p-2 w-full">
                <div className="col-span-2">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="input"
                        placeholder="Product Name"
                        value={product.name ?? ''}
                        onChange={ev => setProduct({ ...product, name: ev.target.value })}
                    />
                    {page.props.errors.name && <InputError message={page.props.errors.name} />}
                </div>
                <div className="col-span-2">
                    <label htmlFor="slug">Slug</label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        className="input"
                        placeholder="Product Slug"
                        value={product.slug ?? ''}
                        onChange={ev => setProduct({ ...product, slug: ev.target.value })}
                    />
                    {page.props.errors.slug && <InputError message={page.props.errors.slug} />}
                </div>
                <div className="col-span-1">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="input"
                        placeholder="Product Price"
                        value={product.price || ''}
                        onChange={ev => setProduct({ ...product, price: Number(ev.target.value) })}
                    />
                    {page.props.errors.price && <InputError message={page.props.errors.price} />}
                </div>
                <div className="col-span-1">
                    <label htmlFor="price-regular">Regular Price</label>
                    <input
                        type="number"
                        name="price_regular"
                        id="price-regular"
                        className="input"
                        placeholder="Regular Price"
                        value={product.price_regular || ''}
                        onChange={ev => setProduct({ ...product, price_regular: Number(ev.target.value) })}
                    />
                    {page.props.errors.price_regular && <InputError message={page.props.errors.price_regular} />}
                </div>
                <div className="col-span-2">
                    <label htmlFor="stock-qty">Stock Quantity</label>
                    <input type="number" value={product.stock_quantity ?? ''}
                           className="input"
                    onChange={ ev => setProduct({ ...product, stock_quantity: Number(ev.target.value) })}
                    />
                    <small>Set stock quantity manually</small>
                    {page.props.errors.stock_quantity && <InputError message={page.props.errors.stock_quantity} />}
                </div>
                <div className="col-span-2">

                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" className="input"
                            value={product.status ?? ''}
                            onChange={ev => setProduct({ ...product, status: Number(ev.target.value) })}
                    >
                        <option value="1">Publish</option>
                        <option value="2">Draft</option>
                        <option value="3">Private</option>
                    </select>
                    {page.props.errors.status && <InputError message={page.props.errors.status} />}
                </div>
                <div className="col-span-2">
                    {product.thumbnail_url &&
                        <div className="max-w-sm overflow-hidden mx-auto">
                            <img src={product.thumbnail_url} />
                        </div>
                    }
                </div>
                <div className="col-span-2 border-zinc-400 border-2 p-2 rounded">
                    <label htmlFor="thumbnail">Thumbnail</label>
                    <input type="file" accept="image/*"
                           className="input"
                           onChange={ev => {
                               const files = ev.target.files;
                               if (files && files.length > 0) {
                                   const file = files[0];
                                   setProduct(p => ({ ...p, thumbnail_file: file }));
                                   fileToDataUrl(file).then(dataUrl => {
                                       setProduct(p => ({ ...p, thumbnail_url: dataUrl }));
                                   });
                               } else {
                                   setProduct(p => ({ ...p, thumbnail_file: null }));
                               }
                           }}
                    />
                    <MessageBox message={page.props.errors.thumbnail_file || ''} isError={true} />
                    <label htmlFor="thumbnail_path">or Enter thumbnail relative path:</label>
                    <input type="text" id="thumbnail_path" placeholder="path..." className="input"
                           value={product.thumbnail_path ?? ''}
                           onChange={ev => {
                               const value = ev.target.value;
                               setProduct(p => ({ ...p, thumbnail_path: value }));
                               setTimeout(() => {
                                   setProduct(p => ({ ...p, thumbnail_url: '/images/' + value }));
                               }, 3000);
                           }}
                    />
                    <MessageBox message={page.props.errors.thumbnail_path || ''} isError={true} />
                </div>
                <div className="col-span-2">
                    <label htmlFor="Snippet">Snippet</label>
                    <textarea
                        className="input"
                        id="Snippet"
                        rows={2}
                        name="snippet"
                        placeholder="Product Snippet"
                        value={product.snippet ?? ''}
                        onChange={ev => setProduct({ ...product, snippet: ev.target.value })}
                    />
                    {page.props.errors.snippet && <InputError message={page.props.errors.snippet} />}
                </div>
                <div className="col-span-2">
                    <label htmlFor="content">Content</label>
                    <textarea
                        className="input"
                        id="content"
                        name="content"
                        rows={10}
                        placeholder="Product Content"
                        value={product.content ?? ''}
                        onChange={ev => setProduct({ ...product, content: ev.target.value })}
                    />
                    {page.props.errors.content && <InputError message={page.props.errors.content} />}
                </div>
                <div className="col-span-2 flex justify-center gap-1 flex flex-col gap-1 items-center">
                    <MessageBox message={page?.flash?.message as string || ''} isError={false} />
                    <Spinner visible={state.loading} />
                    {!state.loading &&
                        <button
                            className="button button-success"
                            onClick={() => {
                                onSubmit();
                            }}
                        >
                            {product?.id ? 'Add product' : 'Update product'}
                        </button>
                    }
                </div>
            </div>
        </AppLayout>
    );
}
