import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { EXTENSION_TYPE_LABELS, EXTENSION_TYPES, USE_CATEGORIES, templatesFor, } from "./catalog.js";
import { ADVISOR_FALLBACK_PROMPT, buildCreationPrompt } from "./prompt.js";
import styles from './creator-center.module.css';
const ADVISOR_PRESET_ID = 'whale-extension-advisor';
function TemplateDetails({ template, disabled, onCopy, onCreate, }) {
    const prompt = buildCreationPrompt({ goal: template.goal, template });
    return (_jsxs("div", { className: styles.details, children: [_jsxs("dl", { className: styles.detailGrid, children: [_jsxs("div", { children: [_jsx("dt", { children: "\u9002\u5408\u4F60\u7684\u60C5\u51B5" }), _jsx("dd", { children: template.suitableFor })] }), _jsxs("div", { children: [_jsx("dt", { children: "\u521B\u5EFA\u540E\u4F1A\u5F97\u5230" }), _jsx("dd", { children: template.result })] }), _jsxs("div", { children: [_jsx("dt", { children: "\u53EF\u80FD\u4FEE\u6539\u7684\u4F4D\u7F6E" }), _jsx("dd", { children: template.changes })] }), _jsxs("div", { children: [_jsx("dt", { children: "\u98CE\u9669\u4E0E\u6743\u9650" }), _jsx("dd", { children: template.risk })] })] }), _jsxs("div", { className: styles.checks, children: [_jsx("strong", { children: "\u5B8C\u6210\u540E\u7684\u68C0\u67E5\u6E05\u5355" }), _jsx("ul", { children: template.checks.map(item => _jsx("li", { children: item }, item)) })] }), _jsxs("label", { className: styles.promptLabel, children: ["\u521B\u5EFA\u8BF4\u660E", _jsx("textarea", { readOnly: true, value: prompt, rows: 8 })] }), _jsxs("div", { className: styles.actions, children: [_jsx("button", { type: "button", disabled: disabled, onClick: () => { onCopy(prompt); }, children: "\u4EC5\u590D\u5236\u63D0\u793A\u8BCD" }), _jsx("button", { type: "button", className: styles.primary, disabled: disabled, onClick: () => { onCreate(prompt); }, children: "\u590D\u5236\u63D0\u793A\u8BCD\u5E76\u5F00\u59CB\u521B\u9020" })] })] }));
}
export function CreatorCenter({ launcher, close, clipboard = navigator.clipboard }) {
    const launch = useSyncExternalStore(launcher.subscribe, launcher.getSnapshot);
    const [browseMode, setBrowseMode] = useState('use');
    const [filter, setFilter] = useState('all');
    const [expanded, setExpanded] = useState(null);
    const [customGoal, setCustomGoal] = useState('');
    const [customPrompt, setCustomPrompt] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [copyError, setCopyError] = useState(null);
    const [status, setStatus] = useState('');
    const [advisorRequested, setAdvisorRequested] = useState(false);
    const [closeOnLaunch, setCloseOnLaunch] = useState(false);
    const [creatorAvailable, setCreatorAvailable] = useState(null);
    const filters = browseMode === 'use' ? USE_CATEGORIES : EXTENSION_TYPES;
    const visibleTemplates = useMemo(() => templatesFor(browseMode, filter), [browseMode, filter]);
    const selectedFilter = filters.find(item => item.id === filter);
    const busy = launch.busy;
    const creatorDisabled = busy || creatorAvailable === false;
    useEffect(() => {
        let active = true;
        void launcher.isPresetAvailable('cordis').then(available => { if (active)
            setCreatorAvailable(available); }, () => { if (active)
            setCreatorAvailable(false); });
        return () => { active = false; };
    }, [launcher]);
    useEffect(() => {
        if (closeOnLaunch && launch.launchedPreset !== null)
            close();
    }, [close, closeOnLaunch, launch.launchedPreset]);
    useEffect(() => {
        if (closeOnLaunch && !advisorRequested && launch.error !== null) {
            setStatus('提示词已复制，但创造会话未能启动。');
        }
    }, [advisorRequested, closeOnLaunch, launch.error]);
    const changeMode = (mode) => {
        setBrowseMode(mode);
        setFilter('all');
    };
    const copyOnly = async (prompt) => {
        setCopyError(null);
        try {
            await clipboard.writeText(prompt);
            setStatus('创建说明已复制。');
            return true;
        }
        catch {
            setCopyError('复制失败。创建说明仍显示在页面中，请手动选择复制。');
            return false;
        }
    };
    const copyAndCreate = async (prompt, presetId = 'cordis') => {
        if (!await copyOnly(prompt))
            return;
        launcher.clearError();
        setCloseOnLaunch(true);
        launcher.launch(presetId);
        setStatus('创建说明已复制；请粘贴并发送。');
    };
    const generateCustomPrompt = () => {
        try {
            const prompt = buildCreationPrompt({ goal: customGoal });
            setValidationError(null);
            setCustomPrompt(prompt);
        }
        catch (error) {
            setCustomPrompt(null);
            setValidationError(error instanceof Error ? error.message : String(error));
        }
    };
    const askAdvisor = () => {
        setAdvisorRequested(true);
        setCopyError(null);
        launcher.clearError();
        setCloseOnLaunch(true);
        launcher.launch(ADVISOR_PRESET_ID);
        setStatus('正在打开 AI 扩展顾问；进入对话后直接说你想解决的问题。');
    };
    const fallbackAdvisor = async () => {
        setAdvisorRequested(false);
        await copyAndCreate(ADVISOR_FALLBACK_PROMPT);
    };
    return (_jsxs("main", { className: styles.page, children: [_jsxs("section", { className: styles.hero, children: [_jsxs("div", { className: styles.heroCopy, children: [_jsx("span", { className: styles.eyebrow, children: "\u521B\u9020\u4E2D\u5FC3 \u00B7 \u65B0\u624B\u5411\u5BFC" }), _jsx("h2", { children: "\u544A\u8BC9 DeepSeek \u4F60\u60F3\u591A\u4F1A\u4E00\u4EF6\u4EC0\u4E48\u4E8B" }), _jsx("p", { children: "\u4E0D\u7528\u5148\u5B66\u63D2\u4EF6\u3002\u9009\u4E00\u4E2A\u76EE\u6807\uFF0C\u6211\u4EEC\u4F1A\u51C6\u5907\u597D\u521B\u5EFA\u8BF4\u660E\uFF0C\u5E76\u7528\u5B98\u65B9\u521B\u9020\u6A21\u5F0F\u5F00\u59CB\u3002" }), _jsxs("ol", { className: styles.steps, "aria-label": "\u521B\u9020\u6B65\u9AA4", children: [_jsxs("li", { children: [_jsx("b", { children: "1" }), "\u9009\u76EE\u6807"] }), _jsxs("li", { children: [_jsx("b", { children: "2" }), "\u770B\u6539\u52A8"] }), _jsxs("li", { children: [_jsx("b", { children: "3" }), "\u5148\u51FA\u8BA1\u5212"] }), _jsxs("li", { children: [_jsx("b", { children: "4" }), "\u9A8C\u8BC1\u518D\u7528"] })] })] }), _jsxs("aside", { className: styles.advisorCard, children: [_jsx("span", { className: styles.aiBadge, children: "AI" }), _jsx("strong", { children: "\u4E0D\u77E5\u9053\u9009\u4EC0\u4E48\uFF1F" }), _jsx("p", { children: "\u7528\u666E\u901A\u8BDD\u8BF4\u9700\u6C42\u3002AI \u6700\u591A\u95EE 3 \u4E2A\u5173\u952E\u95EE\u9898\uFF0C\u518D\u7ED9\u4F60 1\u20133 \u4E2A\u5EFA\u8BAE\u3002" }), _jsx("button", { type: "button", className: styles.primary, disabled: busy, onClick: askAdvisor, children: "\u95EE AI \u6269\u5C55\u987E\u95EE" })] })] }), _jsxs("section", { className: styles.custom, children: [_jsx("label", { htmlFor: "creator-custom-goal", children: "\u6CA1\u6709\u5408\u9002\u6A21\u677F\uFF1F\u63CF\u8FF0\u4F60\u60F3\u89E3\u51B3\u7684\u95EE\u9898" }), _jsxs("div", { className: styles.customRow, children: [_jsx("textarea", { id: "creator-custom-goal", value: customGoal, rows: 2, placeholder: "\u4F8B\u5982\uFF1A\u6BCF\u5929\u628A\u5BA2\u6237\u53CD\u9988\u5206\u6210\u4EA7\u54C1\u3001\u7269\u6D41\u548C\u552E\u540E\u4E09\u7C7B", onChange: (event) => { setCustomGoal(event.currentTarget.value); } }), _jsx("button", { type: "button", onClick: generateCustomPrompt, children: "\u4E3A\u6211\u7684\u9700\u6C42\u751F\u6210\u521B\u5EFA\u8BF4\u660E" })] }), validationError !== null && _jsx("p", { className: styles.error, role: "alert", children: validationError }), customPrompt !== null && (_jsxs("div", { className: styles.customPreview, children: [_jsxs("label", { className: styles.promptLabel, children: ["\u4F60\u7684\u5B89\u5168\u521B\u5EFA\u8BF4\u660E", _jsx("textarea", { readOnly: true, value: customPrompt, rows: 7 })] }), _jsxs("div", { className: styles.actions, children: [_jsx("button", { type: "button", onClick: () => { void copyOnly(customPrompt); }, children: "\u4EC5\u590D\u5236\u63D0\u793A\u8BCD" }), _jsx("button", { type: "button", className: styles.primary, disabled: creatorDisabled, onClick: () => { void copyAndCreate(customPrompt); }, children: "\u590D\u5236\u63D0\u793A\u8BCD\u5E76\u5F00\u59CB\u521B\u9020" })] })] }))] }), creatorAvailable === false && (_jsx("div", { className: styles.fallback, role: "alert", children: _jsxs("div", { children: [_jsx("strong", { children: "\u5B98\u65B9\u521B\u9020\u6A21\u5F0F\u4E0D\u53EF\u7528" }), _jsx("p", { children: "\u8BF7\u5230\u201C\u8BBE\u7F6E \u2192 Agent \u9884\u8BBE\u201D\u6062\u590D\u6216\u68C0\u67E5\u5185\u7F6E\u201C\u521B\u9020\u6A21\u5F0F\uFF08cordis\uFF09\u201D\u3002\u590D\u5236\u63D0\u793A\u8BCD\u4ECD\u53EF\u4F7F\u7528\u3002" })] }) })), _jsxs("section", { className: styles.catalog, children: [_jsxs("header", { className: styles.catalogHeader, children: [_jsxs("div", { children: [_jsx("h3", { children: "\u4ECE\u4E00\u4E2A\u5B9E\u7528\u80FD\u529B\u5F00\u59CB" }), _jsx("p", { children: "\u9ED8\u8BA4\u6309\u7528\u9014\u627E\u6700\u7B80\u5355\uFF1B\u60F3\u5B66\u539F\u7406\u65F6\u518D\u6309\u6269\u5C55\u7C7B\u578B\u770B\u3002" })] }), _jsxs("div", { className: styles.modeSwitch, "aria-label": "\u76EE\u5F55\u6D4F\u89C8\u65B9\u5F0F", children: [_jsx("button", { type: "button", "aria-pressed": browseMode === 'use', onClick: () => { changeMode('use'); }, children: "\u6309\u7528\u9014" }), _jsx("button", { type: "button", "aria-pressed": browseMode === 'type', onClick: () => { changeMode('type'); }, children: "\u6309\u6269\u5C55\u7C7B\u578B" })] })] }), _jsx("div", { className: styles.filters, "aria-label": browseMode === 'use' ? '用途分类' : '扩展类型分类', children: filters.map(item => (_jsx("button", { type: "button", "aria-pressed": filter === item.id, onClick: () => { setFilter(item.id); }, children: item.label }, item.id))) }), browseMode === 'type' && selectedFilter?.description !== undefined && (_jsx("p", { className: styles.filterHelp, children: selectedFilter.description })), _jsx("div", { className: styles.grid, children: visibleTemplates.map(template => {
                            const open = expanded === template.id;
                            return (_jsxs("article", { className: `${styles.template} ${open ? styles.templateOpen : ''}`, "data-testid": "creator-template", children: [_jsxs("div", { className: styles.templateHead, children: [_jsxs("div", { children: [_jsxs("div", { className: styles.badges, children: [_jsx("span", { children: template.difficulty }), _jsx("span", { children: template.duration }), template.extensionTypes.map(type => _jsx("span", { children: EXTENSION_TYPE_LABELS[type] }, type))] }), _jsx("h4", { children: template.title }), _jsx("p", { children: template.benefit })] }), _jsx("button", { type: "button", className: styles.detailButton, "aria-expanded": open, "aria-label": `${open ? '收起' : '查看'}“${template.title}”详情`, onClick: () => { setExpanded(open ? null : template.id); }, children: open ? '收起' : '查看详情' })] }), open && (_jsx(TemplateDetails, { template: template, disabled: creatorDisabled, onCopy: (prompt) => { void copyOnly(prompt); }, onCreate: (prompt) => { void copyAndCreate(prompt); } }))] }, template.id));
                        }) })] }), _jsxs("section", { className: styles.learn, children: [_jsxs("div", { children: [_jsx("strong", { children: "\u8BE5\u505A Skill \u8FD8\u662F\u63D2\u4EF6\uFF1F" }), _jsx("p", { children: "\u8BF4\u660E\u4E66\u7528 Skill\uFF1B\u4E13\u7528\u52A9\u624B\u7528 Agent \u9884\u8BBE\uFF1B\u56FA\u5B9A\u6B65\u9AA4\u7528\u5DE5\u4F5C\u6D41\uFF1B\u5FC5\u987B\u5199\u4EE3\u7801\u65F6\u624D\u7528\u63D2\u4EF6\u3002" })] }), _jsxs("div", { children: [_jsx("strong", { children: "\u521B\u9020\u6A21\u5F0F\u4F1A\u600E\u4E48\u505A\uFF1F" }), _jsx("p", { children: "\u5148\u68C0\u67E5\uFF0C\u518D\u7ED9\u8BA1\u5212\uFF1B\u7ECF\u4F60\u786E\u8BA4\u540E\u5199\u5165\u7528\u6237\u76EE\u5F55\uFF0C\u6D4B\u8BD5\u540E\u62A5\u544A\u542F\u7528\u548C\u64A4\u9500\u65B9\u6CD5\u3002" })] }), _jsxs("div", { children: [_jsx("strong", { children: "\u600E\u4E48\u5224\u65AD\u521B\u5EFA\u6210\u529F\uFF1F" }), _jsx("p", { children: "\u7528\u4E00\u4E2A\u771F\u5B9E\u4F8B\u5B50\u8DD1\u901A\uFF1B\u786E\u8BA4\u542F\u7528\u4F4D\u7F6E\u3001\u9A8C\u8BC1\u547D\u4EE4\u548C\u5B8C\u6574\u64A4\u9500\u65B9\u6CD5\u90FD\u5DF2\u4EA4\u4ED8\u3002" })] }), _jsxs("div", { children: [_jsx("strong", { children: "\u53BB\u54EA\u91CC\u770B\u6E90\u7801\u548C\u6559\u7A0B\uFF1F" }), _jsxs("p", { children: [_jsx("a", { href: "https://github.com/deepseek-ai/deepseek-harness", target: "_blank", rel: "noreferrer", children: "\u5B98\u65B9 Harness GitHub" }), " \u00B7 ", _jsx("a", { href: "https://github.com/zhu1090093659/dsh-web-ui", target: "_blank", rel: "noreferrer", children: "\u793E\u533A UI \u793A\u4F8B" }), " \u00B7 \u684C\u9762\u6258\u76D8 \u2192 \u6269\u5C55\u4E0E\u6559\u7A0B"] })] }), _jsxs("div", { children: [_jsx("strong", { children: "\u8FD8\u662F\u4E0D\u77E5\u9053\u9009\u4EC0\u4E48\uFF1F" }), _jsx("p", { children: _jsx("button", { type: "button", className: styles.learnAction, disabled: busy, onClick: askAdvisor, children: "\u8BA9 AI \u5E2E\u6211\u9009" }) })] })] }), advisorRequested && launch.error !== null && (_jsxs("div", { className: styles.fallback, role: "alert", children: [_jsxs("div", { children: [_jsx("strong", { children: "AI \u987E\u95EE\u9884\u8BBE\u6682\u65F6\u4E0D\u53EF\u7528" }), _jsx("p", { children: launch.error })] }), _jsx("button", { type: "button", disabled: busy, onClick: () => { void fallbackAdvisor(); }, children: "\u590D\u5236\u987E\u95EE\u63D0\u95EE\u6A21\u677F\u5E76\u6253\u5F00\u521B\u9020\u6A21\u5F0F" })] })), !advisorRequested && launch.error !== null && (_jsxs("div", { className: styles.fallback, role: "alert", children: [_jsxs("div", { children: [_jsx("strong", { children: "\u63D0\u793A\u8BCD\u5DF2\u590D\u5236\uFF0C\u4F46\u521B\u9020\u4F1A\u8BDD\u672A\u80FD\u542F\u52A8" }), _jsx("p", { children: launch.error })] }), _jsx("button", { type: "button", onClick: () => { launcher.clearError(); }, children: "\u5173\u95ED\u63D0\u793A" })] })), copyError !== null && _jsx("p", { className: styles.error, role: "alert", children: copyError }), _jsx("p", { className: styles.status, role: "status", "aria-live": "polite", children: status })] }));
}
