import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSyncExternalStore } from 'react';
import { MyExtensionsIcon } from "./SidebarEntryIcons.js";
import styles from './creator-center.module.css';
export function MyExtensionsSidebarAction({ wide, expandSidebar, navigation }) {
    const route = useSyncExternalStore(navigation.subscribe, navigation.getSnapshot);
    const active = route === 'my-extensions';
    return (_jsxs("button", { type: "button", className: `${styles.sidebarEntry} ${active ? styles.sidebarEntryActive : ''}`, "aria-label": "\u6211\u7684\u6269\u5C55", "aria-current": active ? 'page' : undefined, "data-my-extensions-entry": true, onClick: () => {
            if (!wide)
                expandSidebar();
            navigation.openMyExtensions();
        }, children: [_jsx("span", { className: styles.sidebarEntryIcon, "aria-hidden": "true", children: _jsx(MyExtensionsIcon, {}) }), wide && _jsx("span", { className: styles.sidebarEntryLabel, children: "\u6211\u7684\u6269\u5C55" })] }));
}
