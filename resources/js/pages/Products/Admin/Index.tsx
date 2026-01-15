import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import product from '@/routes/product';

export default function Index(){
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <Link href="/admin/products/new">New Product</Link>
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
                    {[1,2,3,4,5].map(item => {
                        return (
                            <tr ley={item}>
                                <td className="max-w-30 min-w-10">
                                    <div className="aspect-square md:max-w-30 max-w-25 min-w-25 overflow-hidden">
                                        <img src="http://localhost:8001/images/products/2025/08/croisillon-emballage-gmgr.jpg"/>
                                    </div>
                                </td>
                                <td className="max-w-10 text-end">4</td>
                                <td><div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                                    <div className="flex gap-1 mt-1">
                                        <Link href={product.edit({productId: 1}).url } className="button button-primary">edit</Link>
                                        <Link href={product.view({slug:"this-is-the-slug"})} className="button button-success"> view</Link>
                                    </div>
                                </div></td>
                                <td className="max-w-10 text-end">23.33</td>
                                <td className="max-w-10 text-end">33</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    )
}
