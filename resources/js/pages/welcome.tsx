import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { useEffect } from 'react';

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
                <div className="w-full min-h-screen overflow-hidden flex flex-col align-items-center justify-center bg-black bg-[url('/assets/images/car1.webp')] bg-right bg-no-repeat bg-contain">
                    <div className="bg-[#00000061] max-w-3xl flex flex-col gap-1 items-end max-sm:items-center text-white p-2">
                        <div>
                            <span className="text-5xl lg:text-8xl font-bold">Your Trusted Auto Parts Store</span>
                        </div>
                        <div>
                            <span>Built for Your Vehicle</span>
                        </div>

                    </div>
                    <div className="mx-auto my-3">
                        <Link href="/products"
                              className="button button-primary text-2xl"
                        >Start Shopping</Link>
                    </div>
                </div>
                <div className="w-full min-h-screen overflow-hidden flex flex-col align-items-center justify-top bg-blue-900 bg-[url('/assets/images/car2.webp')] bg-bottom max-md:bg-contain bg-no-repeat text-white text-center">
                    <div className="max-w-3xl mx-auto py-10 px-2 flex flex-col gap-3 items-center">
                        <div><span className="text-5xl">High quality products for your car</span></div>
                        <div>
                            <p>Explore our high-quality auto parts—including lightbulbs, headlights, electrical wires, and tires—add items to your cart, check out securely, and get support whenever you need it.</p>
                        </div>
                        {!auth.user &&
                            <>
                                <div><p className="text-xl text-pink-300 font-bold">Log in or sign up to add items to your cart, save your preferences, access exclusive features, and shop faster every time.</p></div>
                                <div className="flex gap-2">
                                    <Link
                                        className="button button-primary"
                                        href={login()}>Login</Link>
                                    {canRegister &&
                                        <Link
                                            className="button button-success"
                                            href={register()}>Register</Link>
                                    }
                                </div>
                            </>
                        }

                    </div>
                </div>
            </PublicLayout>
        </>
    );
}
