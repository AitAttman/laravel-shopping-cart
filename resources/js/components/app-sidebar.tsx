import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, PackageIcon, ScanBarcodeIcon, ShoppingCart } from 'lucide-react';
import admin from '@/routes/admin';
import products from '@/routes/products';
import MainLogo from '@/components/ait/MainLogo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        id:'dashboard'
    },
    {
        title: 'Products',
        href: products.index(),
        icon: PackageIcon,
        id:'products'
    },
    {
        title: 'Carts',
        href: admin.carts.index(),
        icon: ShoppingCart,
        id:'carts'
    },
    {
        title: 'Transactions',
        href: admin.transactions.index(),
        icon: ScanBarcodeIcon,
        id:'transactions'
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
        id: 'repository'
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
        id: 'documentation'
    },
];

export function AppSidebar() {
    const page = usePage()
    const isAdmin = page.props.auth?.user?.role === 10;
    const navItems = mainNavItems.filter((item: NavItem) => {
        if( isAdmin )
            return item
        return  ['dashboard'].includes( item.id )
    })
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <div className="w-full">
                                    <MainLogo />
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
