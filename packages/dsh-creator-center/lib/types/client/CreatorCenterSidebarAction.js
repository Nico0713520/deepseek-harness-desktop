import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSyncExternalStore } from 'react';
import { ExtensionCenterIcon } from "./SidebarEntryIcons.js";
import styles from './creator-center.module.css';
export function CreatorCenterSidebarAction({ wide, expandSidebar, navigation }) {
    const route = useSyncExternalStore(navigation.subscribe, navigation.getSnapshot);
    const active = route === 'creator-center';
    return (_jsxs("button", { type: "button", className: `${styles.sidebarEntry} ${active ? styles.sidebarEntryActive : ''}`, "aria-label": "\u6269\u5C55\u4E2D\u5FC3", "aria-current": active ? 'page' : undefined, "data-creator-center-entry": true, onClick: () => {
            if (!wide)
                expandSidebar();
            navigation.open();
        }, children: [_jsx("span", { className: styles.sidebarEntryIcon, "aria-hidden": "true", children: _jsx(ExtensionCenterIcon, {}) }), wide && _jsx("span", { className: styles.sidebarEntryLabel, children: "\u6269\u5C55\u4E2D\u5FC3" })] }));
}
