export default function MessageBox({message , isError = false, className = "p-1", visible = true } : {message: string, isError: boolean, className?: string, visible?: boolean}) {
    const theClassName = ['text-center']
    if( isError )
        theClassName.push('text-red-500')
    else
        theClassName.push('text-green-500')
    if( className )
        theClassName.push(className)
    if( !visible )
        return <></>
    return (
        <p className={theClassName.join(' ')}>{message}</p>
    )
}
