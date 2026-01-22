import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CircleUser, PackageIcon, ScanBarcodeIcon, ShoppingCart } from 'lucide-react';
import admin from '@/routes/admin';
import products from '@/routes/products';
import profile from '@/routes/profile';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    }
];

export default function Dashboard() {
    const page = usePage();
    useEffect(() => {
        console.log( page.props )
    }, []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="overflow-x-auto rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 items-start gap-2">
                {page.props.auth?.user?.role === 10  &&
                    <>
                        <div className="theme-bg-1"><Link href={products.index()} className="block min-h-25 flex justify-center gap-2 items-center text-xl md:text-3xl p-1"><PackageIcon size="32"/><span>Products</span></Link></div>
                        <div className="theme-bg-1"><Link href={admin.carts.index()} className="block min-h-25 flex justify-center gap-2 items-center text-xl md:text-3xl p-1"><ShoppingCart size="32"/><span>Carts</span></Link></div>
                        <div className="theme-bg-1"><Link href={admin.transactions.index()} className="block min-h-25 flex justify-center gap-2 items-center text-xl md:text-3xl p-1"><ScanBarcodeIcon size="32"/><span>Transactions</span></Link></div>
                    </>
                }
                <div className="theme-bg-1"><Link href={profile.edit()} className="block min-h-25 flex justify-center gap-2 items-center text-xl md:text-3xl p-1"><CircleUser size="32"/><span>My Profile</span></Link></div>
            </div>
        </AppLayout>
    );
}
