import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ABILITIES, FEATURED_SCENES, abilitiesFor, recommendAbilities, } from "./catalog.js";
import { AbilityLibrary } from "./AbilityLibrary.js";
import { CreatorGuide } from "./CreatorGuide.js";
import { VibeCodingColumn } from "./VibeCodingColumn.js";
import { ADVISOR_FALLBACK_PROMPT } from "./prompt.js";
import styles from './creator-center.module.css';
const ADVISOR_PRESET_ID = 'whale-extension-advisor';
const NAV_ITEMS = [
    { id: 'discover', label: '找能力' },
    { id: 'vibe', label: 'Vibe Coding' },
    { id: 'guide', label: '创建指南' },
    { id: 'principles', label: '扩展原理' },
];
export function CreatorCenter({ launcher, onClose, clipboard = navigator.clipboard }) {
    const pageRef = useRef(null);
    const launch = useSyncExternalStore(launcher.subscribe, launcher.getSnapshot);
    const [view, setView] = useState('discover');
    const [industry, setIndustry] = useState('all');
    const [kind, setKind] = useState('all');
    const [query, setQuery] = useState('');
    const [problem, setProblem] = useState('');
    const [recommendationIds, setRecommendationIds] = useState(null);
    const [recommendationLabel, setRecommendationLabel] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [copyError, setCopyError] = useState(null);
    const [status, setStatus] = useState('');
    const [advisorRequested, setAdvisorRequested] = useState(false);
    const [closeOnLaunch, setCloseOnLaunch] = useState(false);
    const [creatorAvailable, setCreatorAvailable] = useState(null);
    const busy = launch.busy;
    const creatorDisabled = busy || creatorAvailable === false;
    const visibleAbilities = useMemo(() => {
        if (recommendationIds !== null) {
            return recommendationIds
                .map(id => ABILITIES.find(item => item.id === id))
                .filter((item) => item !== undefined);
        }
        return abilitiesFor({ industry, kind, query });
    }, [industry, kind, query, recommendationIds]);
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
    useEffect(() => {
        const page = pageRef.current;
        if (page !== null && typeof page.scrollIntoView === 'function') {
            page.scrollIntoView({ block: 'start' });
        }
    }, [view]);
    const switchView = (next) => {
        setView(next);
        setValidationError(null);
    };
    const resetDiscovery = () => {
        setIndustry('all');
        setKind('all');
        setQuery('');
        setRecommendationIds(null);
        setRecommendationLabel(null);
        setSelectedId(null);
    };
    const updateIndustry = (next) => {
        setIndustry(next);
        setRecommendationIds(null);
        setRecommendationLabel(null);
        setSelectedId(null);
    };
    const updateKind = (next) => {
        setKind(next);
        setRecommendationIds(null);
        setRecommendationLabel(null);
        setSelectedId(null);
    };
    const updateQuery = (value) => {
        setQuery(value);
        setRecommendationIds(null);
        setRecommendationLabel(null);
        setSelectedId(null);
        setView('discover');
    };
    const findForProblem = () => {
        if (problem.trim().length === 0) {
            setValidationError('先简单说说你想解决的问题。');
            return;
        }
        const matches = recommendAbilities(problem);
        setValidationError(null);
        setIndustry('all');
        setKind('all');
        setQuery('');
        setRecommendationIds(matches.map(item => item.id));
        setRecommendationLabel(`为你推荐 ${matches.length} 个接近的能力`);
        setSelectedId(null);
        setStatus('推荐来自本地能力库；你可以先查看方案，再决定是否创建。');
    };
    const showScene = (scene) => {
        setIndustry('all');
        setKind('all');
        setQuery('');
        setRecommendationIds(scene.abilityIds);
        setRecommendationLabel(`精选场景 · ${scene.title}`);
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
    const startVibe = (abilityId, starter) => {
        setView('discover');
        resetDiscovery();
        if (abilityId === undefined) {
            setProblem(starter);
            return;
        }
        setSelectedId(abilityId);
    };
    return (_jsxs("main", { className: styles.page, ref: pageRef, children: [_jsxs("header", { className: styles.topbar, children: [_jsxs("div", { className: styles.topbarStart, children: [onClose !== undefined && (_jsx("button", { type: "button", className: styles.backButton, onClick: onClose, children: "\u2190 \u8FD4\u56DE\u804A\u5929" })), _jsx("nav", { className: styles.nav, "aria-label": "\u521B\u9020\u4E2D\u5FC3\u5BFC\u822A", children: NAV_ITEMS.map(item => (_jsx("button", { type: "button", "aria-current": view === item.id ? 'page' : undefined, onClick: () => { switchView(item.id); }, children: item.label }, item.id))) })] }), _jsxs("label", { className: styles.search, children: [_jsx("span", { "aria-hidden": "true", children: "\u2315" }), _jsx("span", { className: styles.srOnly, children: "\u641C\u7D22\u80FD\u529B" }), _jsx("input", { type: "search", value: query, placeholder: "\u641C\u7D22\u4F60\u60F3\u589E\u52A0\u7684\u80FD\u529B", "aria-label": "\u641C\u7D22\u80FD\u529B", onChange: (event) => { updateQuery(event.currentTarget.value); } })] })] }), view === 'discover' && (_jsxs(_Fragment, { children: [_jsxs("section", { className: styles.discoveryHero, children: [_jsxs("div", { className: styles.problemCard, children: [_jsx("span", { className: styles.sectionKicker, children: "\u4ECE\u4F60\u7684\u95EE\u9898\u5F00\u59CB" }), _jsx("h2", { children: "\u4F60\u5E0C\u671B DeepSeek \u5E2E\u4F60\u89E3\u51B3\u4EC0\u4E48\u95EE\u9898\uFF1F" }), _jsx("p", { children: "\u4E0D\u7528\u77E5\u9053\u5B9E\u73B0\u65B9\u5F0F\uFF0C\u50CF\u5E73\u65F6\u804A\u5929\u4E00\u6837\u63CF\u8FF0\u5C31\u53EF\u4EE5\u3002" }), _jsxs("label", { className: styles.problemInput, children: [_jsx("span", { className: styles.srOnly, children: "\u63CF\u8FF0\u4F60\u60F3\u89E3\u51B3\u7684\u95EE\u9898" }), _jsx("textarea", { value: problem, rows: 4, "aria-label": "\u63CF\u8FF0\u4F60\u60F3\u89E3\u51B3\u7684\u95EE\u9898", placeholder: "\u4F8B\u5982\uFF1A\u6BCF\u5929\u628A\u5BA2\u6237\u53CD\u9988\u5206\u6210\u4EA7\u54C1\u3001\u7269\u6D41\u548C\u552E\u540E\u4E09\u7C7B", onChange: (event) => { setProblem(event.currentTarget.value); } })] }), _jsx("div", { className: styles.exampleRow, "aria-label": "\u95EE\u9898\u793A\u4F8B", children: ['整理每周工作', '分析一份表格', '做一个小工具'].map(example => (_jsx("button", { type: "button", onClick: () => { setProblem(example); }, children: example }, example))) }), _jsxs("div", { className: styles.problemActions, children: [_jsx("button", { type: "button", className: styles.primaryButton, onClick: findForProblem, children: "\u5E2E\u6211\u627E\u9002\u5408\u7684\u80FD\u529B" }), _jsx("button", { type: "button", className: styles.textButton, disabled: busy, onClick: askAdvisor, children: "\u8BA9 AI \u5E2E\u6211\u5B9A\u5236" })] }), validationError !== null && _jsx("p", { className: styles.error, role: "alert", children: validationError }), _jsxs("ol", { className: styles.capabilityRail, "aria-label": "\u521B\u5EFA\u80FD\u529B\u6D41\u7A0B", children: [_jsxs("li", { children: [_jsx("i", {}), "\u8BF4\u95EE\u9898"] }), _jsxs("li", { children: [_jsx("i", {}), "\u770B\u65B9\u6848"] }), _jsxs("li", { children: [_jsx("i", {}), "\u5F00\u59CB\u521B\u5EFA"] })] })] }), _jsxs("div", { className: styles.featured, children: [_jsxs("header", { children: [_jsxs("div", { children: [_jsx("span", { className: styles.sectionKicker, children: "\u4E0D\u7528\u4ECE\u7A7A\u767D\u5F00\u59CB" }), _jsx("h2", { children: "\u7CBE\u9009\u573A\u666F" })] }), _jsx("span", { children: "\u9009\u62E9\u4E00\u4E2A\u63A5\u8FD1\u7684\u65B9\u5411" })] }), _jsx("div", { className: styles.sceneStrip, children: FEATURED_SCENES.map((scene, index) => (_jsxs("article", { className: styles.sceneCard, "data-scene": index + 1, "data-testid": "featured-scene", children: [_jsxs("div", { className: styles.sceneGraphic, "aria-hidden": "true", children: [_jsx("i", {}), _jsx("i", {}), _jsx("i", {})] }), _jsxs("span", { children: ["\u573A\u666F ", String(index + 1).padStart(2, '0')] }), _jsx("h3", { children: scene.title }), _jsx("p", { children: scene.description }), _jsxs("button", { type: "button", "aria-label": `查看“${scene.title}”场景`, onClick: () => { showScene(scene); }, children: ["\u67E5\u770B\u8FD9\u4E2A\u65B9\u5411 ", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] })] }, scene.id))) })] })] }), creatorAvailable === false && (_jsx("div", { className: styles.notice, role: "alert", children: _jsxs("div", { children: [_jsx("strong", { children: "\u521B\u9020\u529F\u80FD\u6682\u65F6\u4E0D\u53EF\u7528" }), _jsx("p", { children: "\u6D4F\u89C8\u548C\u67E5\u770B\u65B9\u6848\u4E0D\u53D7\u5F71\u54CD\u3002\u8BF7\u5230\u201C\u8BBE\u7F6E \u2192 Agent \u9884\u8BBE\u201D\u6062\u590D\u5185\u7F6E\u521B\u9020\u6A21\u5F0F\u3002" })] }) })), _jsx(AbilityLibrary, { abilities: visibleAbilities, industry: industry, kind: kind, selectedId: selectedId, recommendationLabel: recommendationLabel, creatorDisabled: creatorDisabled, onIndustryChange: updateIndustry, onKindChange: updateKind, onSelect: setSelectedId, onClear: resetDiscovery, onCreate: (prompt) => { void copyAndCreate(prompt); }, onAskAdvisor: askAdvisor })] })), view === 'vibe' && _jsx(VibeCodingColumn, { onStart: startVibe }), (view === 'guide' || view === 'principles') && (_jsx(CreatorGuide, { view: view, onDiscover: () => { switchView('discover'); }, onAskAdvisor: askAdvisor })), advisorRequested && launch.error !== null && (_jsxs("div", { className: styles.notice, role: "alert", children: [_jsxs("div", { children: [_jsx("strong", { children: "AI \u987E\u95EE\u6682\u65F6\u4E0D\u53EF\u7528" }), _jsx("p", { children: launch.error })] }), _jsx("button", { type: "button", disabled: busy, onClick: () => { void fallbackAdvisor(); }, children: "\u590D\u5236\u987E\u95EE\u63D0\u95EE\u6A21\u677F\u5E76\u6253\u5F00\u521B\u9020\u6A21\u5F0F" })] })), !advisorRequested && launch.error !== null && (_jsxs("div", { className: styles.notice, role: "alert", children: [_jsxs("div", { children: [_jsx("strong", { children: "\u521B\u5EFA\u8BF4\u660E\u5DF2\u51C6\u5907\u597D\uFF0C\u4F46\u521B\u9020\u4F1A\u8BDD\u672A\u80FD\u542F\u52A8" }), _jsxs("p", { children: [launch.error, "\u3002\u4F60\u53EF\u4EE5\u91CD\u8BD5\uFF1B\u82E5\u4ECD\u5931\u8D25\uFF0C\u8BF7\u5230\u201C\u8BBE\u7F6E \u2192 Agent \u9884\u8BBE\u201D\u68C0\u67E5\u5185\u7F6E\u521B\u9020\u6A21\u5F0F\u3002"] })] }), _jsx("button", { type: "button", disabled: busy, onClick: retryCreator, children: "\u91CD\u8BD5\u6253\u5F00\u521B\u9020\u6A21\u5F0F" })] })), copyError !== null && _jsx("p", { className: styles.error, role: "alert", children: copyError }), _jsx("p", { className: styles.status, role: "status", "aria-live": "polite", children: status })] }));
}
