import { Link } from '@inertiajs/react';

export default function ErrorPage({status = 404, message = 'Not Found'}: {status?: number, message?: string}) {
    return (
        <div className="flex justify-center items-center gap-1 min-h-screen">
            <div className="border-red-500 border-2 p-3 rounded text-center flex flex-col gap-2">
                <h1 className="text-red-500">{`Error: ${status}`}</h1>
                <p>{message}</p>
                <Link href="/" className="button button-primary">Home</Link>
            </div>
        </div>
    )
}
