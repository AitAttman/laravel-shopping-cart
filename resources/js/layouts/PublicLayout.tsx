import { ReactNode, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SidePanel from '@/components/ait/SidePanel';
import Icon from '@/components/ait/Icon';
import MainLogo from '@/components/ait/MainLogo';
import products from '@/routes/products';
import login from '@/routes/login';
import { dashboard, register } from '@/routes';
import cart from '@/routes/cart';

interface AppLayoutProps {
    children: ReactNode;
    title?: string

}
export default function PublicLayout({children,title = "", ...props}: AppLayoutProps) {
    const [sidePanelVisible, setSidePanelVisibility] = useState<boolean>(false);
    const page = usePage();
    return (
        <>
            <Head title={title || ""}>
                <meta name="hello_world" content="message here" />
            </Head>
            <header className="theme-bg-1 min-h-[50px] flex justify-between items-center shadow-sm relative">
                <div className="flex gap-2">
                    <button className="button button-transparent"
                            onClick={() => setSidePanelVisibility(true)}
                    ><Icon icon="menu" /></button>
                    <div><Link href="/"><MainLogo className="h-10"/></Link></div>
                </div>
                <div className="flex gap-2 px-2 items-center">
                    <ul className="flex gap-2 max-sm:hidden">
                        <li><Link href={products.public.index().url} className="hover:text-orange-300">All Products</Link></li>
                        <li><a href="#" className="hover:text-orange-300">About Us</a></li>
                        <li><a href="#" className="hover:text-orange-300">Contact Us</a></li>
                    </ul>
                    {page.props.auth?.user &&
                            <Link href={cart.view()} className="block">
                                <Icon icon="shopping-cart"/>
                            </Link>
                    }
                </div>
            </header>
            <div {...props}>
                {children}
            </div>
            <footer className="bg-zinc-600 text-white p-2">
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
                    <div className="flex flex-col">
                        <div><b className="text-4xl">MyStore</b></div>
                        <Link href="#">About Us</Link>
                        <Link href="#">Blog</Link>
                        <Link href="#">Contact Us</Link>
                        <Link href="#">Investors</Link>
                        <Link href="#">Promotions</Link>
                    </div>
                    <div className="flex flex-col gap">
                        <b className="text-md">Need help?</b>
                        <Link href="#">Help</Link>
                        <Link href="#">FAQ</Link>
                    </div>
                    <div className="flex flex-col gap">
                        <b className="text-md">Top Categories</b>
                        <Link href="#">Light Bulbs</Link>
                        <Link href="#">Electrical Wires</Link>
                        <Link href="#">Pumps</Link>
                    </div>
                </div>
            </footer>
            <SidePanel visible={sidePanelVisible} onClose={() => setSidePanelVisibility(false)}>
                <ul className="divide-y divide-gray-300">
                    <li>
                        <Link href="/" className="py-1 px-2 flex items-center gap-1">
                            <Icon icon="home"/><span>Home</span></Link>
                    </li>
                    {
                        page.props.auth?.user &&
                        <li>
                            <Link href={dashboard()} className="py-1 px-2 flex items-center gap-1">
                                <Icon icon="settings"/><span>Dashboard</span></Link>
                        </li>
                    }
                    <li>
                        <Link href={products.public.index().url} className="py-1 px-2 flex items-center gap-1">
                            <Icon icon="store"/><span>Products</span></Link>
                    </li>
                    {
                        page.props.auth?.user &&
                        <li>
                            <Link href="/cart" className="py-1 px-2 flex items-center gap-1">
                                <Icon icon="store"/><span>My Cart</span></Link>
                        </li>
                    }
                    {!page.props.auth?.user &&
                        <>
                            <li className="hover:bg-blue-300 dark:hover:bg-blue-800">
                                <Link href={login.store().url} className="py-1 px-2 flex items-center gap-1">
                                    <Icon icon="login"/><span>Login</span></Link>
                            </li>
                            <li>
                                <Link href={register().url} className="py-1 px-2 flex items-center gap-1">
                                    <Icon icon="person"/><span>Register</span></Link>
                            </li>
                        </>
                    }
                </ul>
            </SidePanel>
        </>
    )
}
