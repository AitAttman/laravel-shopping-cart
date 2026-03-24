import { ChangeEvent, useEffect, useState } from "react";
import "./toggleSwitch.css";
import { PlainObject } from "./types";
type ToggleSwitchArgs = {
    label: string,
    id:string,
    name?:string,
    checked?:boolean,
    value?:string,
    type?: string,
    className?:string,
    onChange? : ( (ev:ChangeEvent<HTMLInputElement>) => void)|undefined
    attrs? : PlainObject
}
export default function ToggleSwitch({
    label,
    id,
    name = '',
    checked = false,
    value = 'true',
    type= 'checkbox',
    onChange = undefined,
    className = '',
    attrs = {}
                      }:ToggleSwitchArgs){
    const [isChecked, setIsChecked ] = useState<boolean>( checked )
    const classNames = ['toggle-switch']
    if( className )
        classNames.push( className )
    useEffect(() => {
        setIsChecked( checked )
    }, [checked]);
    return (
        <div className={classNames.join(' ')}>
            <label htmlFor={id}>{label}</label>
            <input
                onChange={(ev:ChangeEvent<HTMLInputElement>) => {
                    setIsChecked(ev.target.checked)
                    if( onChange )
                        onChange( ev )
                }}
                checked={isChecked}
                type={type}
                name={name}
                id={id} value={value}
                { ...attrs}
            />
        </div>
    )
}
