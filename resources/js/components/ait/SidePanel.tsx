import { createPortal } from 'react-dom';
import { ReactNode, useState } from 'react';

interface SidePanelProps {
    children: ReactNode;
    position?:string;
    visible?: boolean;
    className?: string;
    onClose: () => void;
}
export default function SidePanel({ children, position="start", visible = false,className = "", onClose }: SidePanelProps) {
    return createPortal(
        <>
            <div className={`sidepanel w-[280px] bg-background${className ? ' ': ''}${className || ""}`}
                 data-position={position} data-visible={visible}>
                {children}
            </div>
            <div className="overly bg-zinc-500"
                 onClick={onClose}
                 data-visible={visible}></div>
        </>
        , document.body)
}
