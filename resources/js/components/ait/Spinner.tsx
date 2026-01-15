import { JSX } from 'react';

interface SpinnerProps {
    visible?: boolean;
}
export default function Spinner({ visible = true }: SpinnerProps): JSX.Element {
    if( !visible )
    return (<></>)
    return (
        <div className="w-5 aspect-square m-2 animate-spin rounded-full border-2 border-gray-300 border-t-zinc-600"></div>
    )
}
