import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useSyncExternalStore } from 'react';
import { CreatorCenter } from "./CreatorCenter.js";
import styles from './creator-center.module.css';
function useShellLeft() {
    const [left, setLeft] = useState(280);
    useEffect(() => {
        const update = () => {
            const frame = document.querySelector('[data-sidebar-collapsed]');
            const sidebar = frame?.firstElementChild;
            const frameRect = frame?.getBoundingClientRect();
            const sidebarRect = sidebar?.getBoundingClientRect();
            if (frameRect === undefined || sidebarRect === undefined) {
                setLeft(280);
                return;
            }
            setLeft(Math.max(0, Math.round(sidebarRect.right - frameRect.left)));
        };
        update();
        const frame = document.querySelector('[data-sidebar-collapsed]');
        const observer = frame !== null && typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(update)
            : undefined;
        if (frame !== null)
            observer?.observe(frame);
        window.addEventListener('resize', update);
        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', update);
        };
    }, []);
    return left;
}
export function CreatorCenterSurface({ navigation, launcher }) {
    const route = useSyncExternalStore(navigation.subscribe, navigation.getSnapshot);
    const left = useShellLeft();
    if (route !== 'creator-center')
        return null;
    return (_jsx("div", { className: styles.surface, style: { left }, "data-creator-center-surface": true, "data-testid": "creator-center-surface", children: _jsx(CreatorCenter, { launcher: launcher, onClose: () => { navigation.close(); } }) }));
}
