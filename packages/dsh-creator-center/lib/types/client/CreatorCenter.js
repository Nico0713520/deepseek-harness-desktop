import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { abilitiesFor, } from "./catalog.js";
import { AbilityLibrary } from "./AbilityLibrary.js";
import { ADVISOR_FALLBACK_PROMPT } from "./prompt.js";
import styles from './creator-center.module.css';
const ADVISOR_PRESET_ID = 'whale-extension-advisor';
export function CreatorCenter({ launcher, onClose, clipboard = navigator.clipboard }) {
    const launch = useSyncExternalStore(launcher.subscribe, launcher.getSnapshot);
    const [industry, setIndustry] = useState('all');
    const [kind, setKind] = useState('all');
    const [selectedId, setSelectedId] = useState(null);
    const [copyError, setCopyError] = useState(null);
    const [status, setStatus] = useState('');
    const [advisorRequested, setAdvisorRequested] = useState(false);
    const [closeOnLaunch, setCloseOnLaunch] = useState(false);
    const [creatorAvailable, setCreatorAvailable] = useState(null);
    const busy = launch.busy;
    const creatorDisabled = busy || creatorAvailable === false;
    const visibleAbilities = useMemo(() => abilitiesFor({ industry, kind, query: '' }), [industry, kind]);
    useEffect(() => {
        let active = true;
        void launcher.isPresetAvailable('cordis').then(available => { if (active)
            setCreatorAvailable(available); }, () => { if (active)
            setCreatorAvailable(false); });
        return () => { active = false; };
    }, [launcher]);
    useEffect(() => {
        if (closeOnLaunch && launch.launchedPreset !== null)
            onClose?.();
    }, [closeOnLaunch, launch.launchedPreset, onClose]);
    useEffect(() => {
        if (closeOnLaunch && !advisorRequested && launch.error !== null) {
            setStatus('创建说明已准备好，但创造会话未能启动。');
        }
    }, [advisorRequested, closeOnLaunch, launch.error]);
    const resetDiscovery = () => {
        setIndustry('all');
        setKind('all');
        setSelectedId(null);
    };
    const updateIndustry = (next) => {
        setIndustry(next);
        setSelectedId(null);
    };
    const updateKind = (next) => {
        setKind(next);
        setSelectedId(null);
    };
    const copyOnly = async (prompt) => {
        setCopyError(null);
        try {
            await clipboard.writeText(prompt);
            setStatus('创建说明已准备好。');
            return true;
        }
        catch {
            setCopyError('复制失败。创建说明仍在高级信息中，请手动选择复制。');
            return false;
        }
    };
    const copyAndCreate = async (prompt, presetId = 'cordis') => {
        if (!await copyOnly(prompt))
            return;
        launcher.clearError();
        setAdvisorRequested(false);
        setCloseOnLaunch(true);
        launcher.launch(presetId);
        setStatus('创建说明已准备好；进入创造会话后请粘贴并发送。');
    };
    const askAdvisor = () => {
        setAdvisorRequested(true);
        setCopyError(null);
        launcher.clearError();
        setCloseOnLaunch(true);
        launcher.launch(ADVISOR_PRESET_ID);
        setStatus('正在打开 AI 顾问；进入对话后直接说你想解决的问题。');
    };
    const fallbackAdvisor = async () => {
        setAdvisorRequested(false);
        await copyAndCreate(ADVISOR_FALLBACK_PROMPT);
    };
    const retryCreator = () => {
        setAdvisorRequested(false);
        launcher.clearError();
        setCloseOnLaunch(true);
        launcher.launch('cordis');
        setStatus('正在重新打开创造模式…');
    };
    return (_jsxs("main", { className: styles.page, children: [creatorAvailable === false && (_jsx("div", { className: styles.notice, role: "alert", children: _jsxs("div", { children: [_jsx("strong", { children: "\u521B\u9020\u529F\u80FD\u6682\u65F6\u4E0D\u53EF\u7528" }), _jsx("p", { children: "\u6D4F\u89C8\u548C\u67E5\u770B\u65B9\u6848\u4E0D\u53D7\u5F71\u54CD\u3002\u8BF7\u5230\u201C\u8BBE\u7F6E \u2192 Agent \u9884\u8BBE\u201D\u6062\u590D\u5185\u7F6E\u521B\u9020\u6A21\u5F0F\u3002" })] }) })), _jsx(AbilityLibrary, { abilities: visibleAbilities, industry: industry, kind: kind, selectedId: selectedId, creatorDisabled: creatorDisabled, onIndustryChange: updateIndustry, onKindChange: updateKind, onSelect: setSelectedId, onClear: resetDiscovery, onCreate: (prompt) => { void copyAndCreate(prompt); }, onAskAdvisor: askAdvisor }), advisorRequested && launch.error !== null && (_jsxs("div", { className: styles.notice, role: "alert", children: [_jsxs("div", { children: [_jsx("strong", { children: "AI \u987E\u95EE\u6682\u65F6\u4E0D\u53EF\u7528" }), _jsx("p", { children: launch.error })] }), _jsx("button", { type: "button", disabled: busy, onClick: () => { void fallbackAdvisor(); }, children: "\u590D\u5236\u987E\u95EE\u63D0\u95EE\u6A21\u677F\u5E76\u6253\u5F00\u521B\u9020\u6A21\u5F0F" })] })), !advisorRequested && launch.error !== null && (_jsxs("div", { className: styles.notice, role: "alert", children: [_jsxs("div", { children: [_jsx("strong", { children: "\u521B\u5EFA\u8BF4\u660E\u5DF2\u51C6\u5907\u597D\uFF0C\u4F46\u521B\u9020\u4F1A\u8BDD\u672A\u80FD\u542F\u52A8" }), _jsxs("p", { children: [launch.error, "\u3002\u4F60\u53EF\u4EE5\u91CD\u8BD5\uFF1B\u82E5\u4ECD\u5931\u8D25\uFF0C\u8BF7\u5230\u201C\u8BBE\u7F6E \u2192 Agent \u9884\u8BBE\u201D\u68C0\u67E5\u5185\u7F6E\u521B\u9020\u6A21\u5F0F\u3002"] })] }), _jsx("button", { type: "button", disabled: busy, onClick: retryCreator, children: "\u91CD\u8BD5\u6253\u5F00\u521B\u9020\u6A21\u5F0F" })] })), copyError !== null && _jsx("p", { className: styles.error, role: "alert", children: copyError }), _jsx("p", { className: styles.status, role: "status", "aria-live": "polite", children: status })] }));
}
