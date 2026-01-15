type IconProps = {
    icon?: string;
    fill?: string;
    size?: number;
    className?: string;
}
export default function Icon({icon = "home", fill = "fill-foreground" , size = 24, className = "" } : IconProps) {
    const theClassName = ['aspect-square pointer-events-none', fill]
    if( className )
        theClassName.push(className)
    return (
        <svg className={theClassName.join(" ")} width={size}>
            <use href={`/assets/icons.svg#${icon}`}/>
        </svg>
    )
}
