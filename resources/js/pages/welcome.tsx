import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';

export default function Welcome({
                                    canRegister = true,
                                }: {
    canRegister?: boolean;
}) {
    const { auth,quote } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to your Store">
            </Head>
            <PublicLayout>
                <div className="w-full min-h-screen overflow-hidden flex flex-col align-items-center justify-center bg-[url('http://localhost:8000/images/products/2025/08/iwke-ewek-1.jpg')] bg-center">
                    <div className="bg-[#00000061] max-w-3xl flex flex-col gap-1 items-end max-sm:items-center">
                        <div>
                            <b className="text-8xl">Hello world</b>
                        </div>
                        <div>
                            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</span>
                        </div>

                    </div>
                    <div className="mx-auto my-3">
                        <Link href="/products"
                              className="button button-primary text-xl"
                        >Start Shopping</Link>
                    </div>
                </div>
            </PublicLayout>
        </>
    );
}
