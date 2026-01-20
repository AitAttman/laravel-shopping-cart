import { Form, Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { MouseEventHandler, useState } from 'react';
import InputError from '@/components/input-error';

type Product = {
    price?: number;
    price_regular?: number;
    content?: string;
    name?: string;
    [key:string]:any;
}
type PlainObject = {
    [key: string]: any;
}
export default function EditProduct(){
    const [errors, setErrors] = useState<PlainObject>({});
    return (
        <AppLayout>
            <Head title="Dashboard" />
            {errors.error &&
                <p className="text-center text-red-500 text-md font-bold px-2 py-3">{errors.error}</p>}
            <Form method="post"
                  className="mx-auto w-full max-w-150 p-2"
                  action="/admin/products"
                  transform={(data) => {
                      return ({...data, price: Number(data.price || 0), price_regular: Number(data.price_regular || 0),
                      status: Number(data.status || 0),
                      })
                  }}
                  showProgress={true}
                  onProgress={(progress) => {
                      console.log(progress);
                  }}
                  onFlash={(data) => {
                      console.log( 'flash data:', data );
                  }}
                  onError={(data) => {
                      setErrors(data)
                  }}
                  onSuccess={(data) => {
                      console.log( 'success:', data );
                  }}
                  onSubmit={() => setErrors({})}
            >
                <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                        <label htmlFor="name">Title</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="input"
                            placeholder="Product Name"
                        />
                        {errors.name && <InputError message={errors.name} />}
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="slug">Slug</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            className="input"
                            placeholder="Product Slug"
                        />
                        {errors.slug && <InputError message={errors.slug} />}
                    </div>
                    <div className="col-span-1">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="input"
                            placeholder="Product Price"
                        />
                        {errors.price && <InputError message={errors.price} />}
                    </div>
                    <div className="col-span-1">
                        <label htmlFor="price-regular">Regular Price</label>
                        <input
                            type="number"
                            name="price_regular"
                            id="price-regular"
                            className="input"
                            placeholder="Regular Price"
                        />
                        {errors.price_regular && <InputError message={errors.price_regular} />}
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="status">Status</label>
                        <select name="statys" id="status" name="status" className="input">
                            <option value="1">Publish</option>
                            <option value="2">Draft</option>
                            <option value="3">Private</option>
                        </select>
                        {errors.status && <InputError message={errors.status} />}
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="Snippet">Snippet</label>
                        <textarea
                            className="input"
                            id="Snippet"
                            rows={2}
                            name="snippet"
                            placeholder="Product Snippet"
                        ></textarea>
                        {errors.snippet && <InputError message={errors.snippet} />}
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="content">Content</label>
                        <textarea
                            className="input"
                            id="content"
                            name="content"
                            rows={10}
                            placeholder="Product Content"
                        ></textarea>
                        {errors.content && <InputError message={errors.content} />}
                    </div>
                    <div className="col-span-2 flex justify-center gap-1">
                        <button
                            className="button button-success"
                            type="submit"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </Form>
        </AppLayout>
    );
}
