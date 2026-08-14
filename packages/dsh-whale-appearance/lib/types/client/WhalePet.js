import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState, useSyncExternalStore } from 'react';
import styles from './pet.module.css';
const ASSETS = {
    'whale-maid': {
        src: '/whale-appearance/assets/whale-maid.jpg',
        alt: '鲸鱼女仆桌宠',
    },
    'abstract-whale': {
        src: '/whale-appearance/assets/abstract-whale.jpg',
        alt: '抽象鲸鱼桌宠',
    },
};
export function activityClass(activity) {
    return activity;
}
function clamp(value, max) {
    return Math.round(Math.max(0, Math.min(max, value)));
}
export function WhalePet({ controller }) {
    const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot);
    const [drag, setDrag] = useState(null);
    const start = useRef(null);
    if (snapshot.pet === 'off')
        return null;
    const asset = ASSETS[snapshot.pet];
    const position = drag ?? snapshot.petPosition;
    const size = Math.round(168 * snapshot.petScale);
    const pointerDown = (event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        start.current = {
            x: event.clientX,
            y: event.clientY,
            right: position.right,
            bottom: position.bottom,
        };
    };
    const pointerMove = (event) => {
        const origin = start.current;
        if (origin === null)
            return;
        setDrag({
            right: clamp(origin.right - (event.clientX - origin.x), Math.max(0, window.innerWidth - size)),
            bottom: clamp(origin.bottom - (event.clientY - origin.y), Math.max(0, window.innerHeight - size)),
        });
    };
    const pointerUp = (event) => {
        if (start.current === null)
            return;
        event.currentTarget.releasePointerCapture(event.pointerId);
        const finalPosition = drag ?? position;
        start.current = null;
        setDrag(null);
        void controller.patch({ petPosition: finalPosition }).catch(() => { });
    };
    return (_jsx("div", { className: styles.overlay, "aria-live": "off", children: _jsx("div", { className: `${styles.pet} ${styles[activityClass(snapshot.activity)]}`, "data-whale-pet": snapshot.pet, style: { right: position.right, bottom: position.bottom, width: size, height: size }, onPointerDown: pointerDown, onPointerMove: pointerMove, onPointerUp: pointerUp, onPointerCancel: pointerUp, children: _jsx("img", { src: asset.src, alt: asset.alt, draggable: false }) }) }));
}
