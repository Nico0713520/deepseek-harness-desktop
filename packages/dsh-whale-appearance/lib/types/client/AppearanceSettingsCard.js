import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useSyncExternalStore } from 'react';
import styles from './settings-card.module.css';
const PETS = [
    { id: 'off', label: '关闭' },
    { id: 'whale-maid', label: '鲸鱼女仆' },
    { id: 'abstract-whale', label: '抽象鲸鱼' },
];
const SCALES = [0.8, 1, 1.2];
export function AppearanceSettingsCard({ controller }) {
    const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const update = (patch) => {
        setBusy(true);
        setError(null);
        void controller.patch(patch).catch(() => {
            setError('保存失败，已保留当前外观。');
        }).finally(() => { setBusy(false); });
    };
    return (_jsxs("div", { className: styles.card, "data-whale-settings-card": true, children: [_jsxs("header", { className: styles.header, children: [_jsx("span", { className: styles.icon, "aria-hidden": "true", children: "\uD83D\uDC0B" }), _jsxs("span", { children: [_jsx("strong", { className: styles.title, children: "\u4E3B\u9898\u4E0E\u684C\u5BA0" }), _jsx("span", { className: styles.description, children: "\u53EA\u88C5\u9970\u804A\u5929\u753B\u5E03\uFF0C\u5B98\u65B9\u4FA7\u680F\u548C\u8F93\u5165\u6846\u4FDD\u6301\u4E0D\u53D8\u3002" })] })] }), _jsxs("section", { className: styles.section, children: [_jsxs("div", { children: [_jsx("strong", { children: "\u9CB8\u9C7C\u4E3B\u9898" }), _jsx("p", { children: snapshot.themeEnabled ? '鲸鱼画布' : '官方外观' })] }), _jsx("button", { type: "button", className: `${styles.switch} ${snapshot.themeEnabled ? styles.switchOn : ''}`, "aria-label": snapshot.themeEnabled ? '恢复官方外观' : '使用鲸鱼画布', "aria-pressed": snapshot.themeEnabled, disabled: busy, onClick: () => { update({ themeEnabled: !snapshot.themeEnabled }); }, children: _jsx("span", {}) })] }), _jsxs("section", { className: styles.block, children: [_jsx("strong", { children: "\u684C\u5BA0" }), _jsx("div", { className: styles.segmented, children: PETS.map(pet => (_jsx("button", { type: "button", "aria-pressed": snapshot.pet === pet.id, className: snapshot.pet === pet.id ? styles.selected : '', disabled: busy, onClick: () => { update({ pet: pet.id }); }, children: pet.label }, pet.id))) })] }), _jsxs("section", { className: styles.block, children: [_jsx("strong", { children: "\u684C\u5BA0\u5927\u5C0F" }), _jsx("div", { className: styles.segmented, children: SCALES.map(scale => (_jsxs("button", { type: "button", "aria-pressed": snapshot.petScale === scale, className: snapshot.petScale === scale ? styles.selected : '', disabled: busy, onClick: () => { update({ petScale: scale }); }, children: [Math.round(scale * 100), "%"] }, scale))) })] }), _jsxs("footer", { className: styles.footer, children: [_jsx("button", { type: "button", disabled: busy, onClick: () => { update({ petPosition: { right: 24, bottom: 24 } }); }, children: "\u91CD\u7F6E\u684C\u5BA0\u4F4D\u7F6E" }), _jsx("button", { type: "button", className: styles.restore, disabled: busy, onClick: () => { update({ themeEnabled: false, pet: 'off', petScale: 1, petPosition: { right: 24, bottom: 24 } }); }, children: "\u6062\u590D\u5B98\u65B9\u5916\u89C2" })] }), error !== null && _jsx("p", { className: styles.error, role: "alert", children: error })] }));
}
