export default function MessageBox({message , isError = false, className = ""} : {message: string, isError: boolean, className?: string}) {
    const theClassName = []
    if( isError )
        theClassName.push('text-red-500')
    else
        theClassName.push('text-green-500')
    if( className )
        theClassName.push(className)
    if( !message )
        return <></>
    return (
        <p className={theClassName.join(' ')}>{message}</p>
    )
}
