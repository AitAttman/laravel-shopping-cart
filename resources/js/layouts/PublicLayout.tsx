import { ReactNode, useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SidePanel from '@/components/ait/SidePanel';
import Icon from '@/components/ait/Icon';
import MainLogo from '@/components/ait/MainLogo';
import products from '@/routes/products';
import login from '@/routes/login';
import { register } from '@/routes';

interface AppLayoutProps {
    children: ReactNode;
    title?: string

}
export default function PublicLayout({children,title = "", ...props}: AppLayoutProps) {
    const [sidePanelVisible, setSidePanelVisibility] = useState<boolean>(false);
    const page = usePage();
    useEffect(() => {
        console.log( page )
    }, []);
    return (
        <>
            <Head title={title || ""}>
                <meta name="hello_world" content="message here" />
            </Head>
            <header className="bg-blue-300 dark:bg-blue-900 min-h-[50px] flex justify-between items-center">
                <div className="flex gap-2">
                    <button className="button button-transparent"
                            onClick={() => setSidePanelVisibility(true)}
                    ><Icon icon="menu" /></button>
                    <div><Link href="/"><MainLogo className="h-10"/></Link></div>
                </div>
                <div className="flex gap-2 px-2 items-center">
                    <ul className="flex gap-2 max-sm:hidden">
                        <li><Link href={products.public.index().url} className="hover:text-white">All Products</Link></li>
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    </ul>
                    <div>
                        <button className="button button-transparent">
                            <Icon icon="shopping-cart"/>
                        </button>
                    </div>
                </div>
            </header>
            <div {...props}>
                {children}
            </div>
            <footer className="bg-gray-700 border-t-5 border-orange-700">
                <div>
                    <div><span className="text-4xl">Company</span></div>
                    <div><span className="text-xl">+2127373333</span></div>
                </div>
            </footer>
            <SidePanel visible={sidePanelVisible} onClose={() => setSidePanelVisibility(false)}>
                <ul className="divide-y divide-gray-300">
                    <li>
                        <Link href="/" className="py-1 px-2 flex items-center gap-1">
                            <Icon icon="home"/><span>Home</span></Link>
                    </li>
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
                    {
                        page.props?.auth?.user &&
                        <li>
                            <Link href="#" className="py-1 px-2 flex items-center gap-1">
                                <Icon icon="person"/><span>My Account</span></Link>
                        </li>
                    }
                </ul>
            </SidePanel>
        </>
    )
}
