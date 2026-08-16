import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './creator-center.module.css';
const EXTENSION_KIND_LABELS = {
    skill: 'Skill',
    plugin: '插件',
};
const EXTENSION_KIND_HINTS = {
    skill: '给 DeepSeek 增加一套可复用的工作方法。',
    plugin: '给 DeepSeek 增加一个可以调用的工具连接。',
};
export async function fetchUserExtensions(fetcher = globalThis.fetch) {
    const response = await fetcher('/api/whale-creator-center/user-extensions', { cache: 'no-store' });
    const body = await response.json();
    if (!response.ok || body.ok !== true || !Array.isArray(body.extensions)) {
        throw new Error(body.error ?? '无法读取本地扩展');
    }
    return body.extensions;
}
async function removeUserExtension(id, fetcher) {
    const response = await fetcher(`/api/whale-creator-center/user-extensions/${encodeURIComponent(id)}`, {
        method: 'DELETE',
    });
    const body = await response.json();
    if (!response.ok || body.ok !== true)
        throw new Error(body.error ?? '删除失败');
}
function typeLabel(extension) {
    return EXTENSION_KIND_LABELS[extension.kind];
}
function extensionCard(extension, onSelect) {
    return (_jsxs("article", { className: styles.abilityCard, "data-testid": "user-extension-card", tabIndex: 0, "aria-label": `打开“${extension.title}”详情`, onClick: onSelect, onKeyDown: event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect();
            }
        }, children: [_jsxs("div", { className: styles.cardTopline, children: [_jsx("div", { className: styles.cardMarker, "aria-hidden": "true", children: _jsx("span", { children: extension.title.slice(0, 1).toUpperCase() }) }), _jsxs("div", { className: styles.cardBadges, children: [_jsx("span", { children: typeLabel(extension) }), _jsx("span", { className: styles.extensionLocalBadge, children: "\u672C\u673A\u5DF2\u6DFB\u52A0" })] })] }), _jsx("h3", { children: extension.title }), _jsx("p", { className: styles.cardOutcome, children: EXTENSION_KIND_HINTS[extension.kind] }), _jsx("p", { className: styles.cardSummary, children: extension.summary }), _jsxs("div", { className: styles.cardSourceLine, children: [_jsx("span", { children: extension.category }), _jsx("span", { children: "\u7528\u6237\u81EA\u5DF1\u6DFB\u52A0" })] }), _jsxs("footer", { className: styles.cardFooter, children: [_jsxs("div", { className: styles.cardTags, children: [_jsx("span", { children: typeLabel(extension) }), _jsx("span", { children: "\u672C\u5730\u7BA1\u7406" })] }), _jsxs("button", { type: "button", "aria-label": `查看“${extension.title}”详情`, onClick: event => { event.stopPropagation(); onSelect(); }, children: ["\u67E5\u770B\u8BE6\u60C5 ", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] })] })] }, extension.id));
}
export function MyExtensions({ onClose, fetcher = globalThis.fetch }) {
    const [extensions, setExtensions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [kind, setKind] = useState('all');
    const [category, setCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');
    const detailRef = useRef(null);
    useEffect(() => {
        let active = true;
        setLoading(true);
        void fetchUserExtensions(fetcher).then(value => {
            if (!active)
                return;
            setExtensions(value);
            setError(null);
        }, reason => {
            if (!active)
                return;
            setError(reason instanceof Error ? reason.message : '无法读取本地扩展');
        }).finally(() => {
            if (active)
                setLoading(false);
        });
        return () => { active = false; };
    }, [fetcher]);
    const categories = useMemo(() => ['all', ...new Set(extensions.map(item => item.category))], [extensions]);
    const visibleExtensions = useMemo(() => {
        return extensions.filter(item => {
            if (kind !== 'all' && item.kind !== kind)
                return false;
            if (category !== 'all' && item.category !== category)
                return false;
            return true;
        });
    }, [category, extensions, kind]);
    const selected = extensions.find(item => item.id === selectedId);
    useEffect(() => {
        if (selected === undefined)
            return;
        const frame = window.requestAnimationFrame(() => {
            detailRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
            detailRef.current?.querySelector('h3')?.focus();
        });
        return () => { window.cancelAnimationFrame(frame); };
    }, [selected]);
    useEffect(() => {
        if (selected === undefined)
            return;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape')
                setSelectedId(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => { window.removeEventListener('keydown', handleKeyDown); };
    }, [selected]);
    const removeSelected = async () => {
        if (selected === undefined)
            return;
        if (!window.confirm(`确认从本机删除“${selected.title}”吗？`))
            return;
        try {
            await removeUserExtension(selected.id, fetcher);
            setExtensions(items => items.filter(item => item.id !== selected.id));
            setSelectedId(null);
            setStatus(selected.kind === 'plugin' ? `已从我的扩展移除 ${selected.title}；profile 依赖仍保留。` : `已删除 ${selected.title}`);
            setError(null);
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : '删除失败');
        }
    };
    return (_jsxs("main", { className: styles.page, children: [_jsx("section", { className: styles.library, "aria-label": "\u6211\u7684\u6269\u5C55 Hub", children: selected !== undefined ? (_jsx("div", { ref: detailRef, className: styles.detailPage, children: _jsxs("section", { className: styles.abilityDetail, role: "region", "aria-label": `${selected.title}详情`, children: [_jsx("button", { type: "button", className: styles.backButton, "aria-label": "\u8FD4\u56DE\u6211\u7684\u6269\u5C55", onClick: () => { setSelectedId(null); }, children: "\u2190 \u8FD4\u56DE\u6211\u7684\u6269\u5C55" }), _jsx("header", { className: styles.detailHeader, children: _jsxs("div", { children: [_jsxs("span", { className: styles.sectionKicker, children: ["\u672C\u673A\u5DF2\u6DFB\u52A0 \u00B7 ", typeLabel(selected)] }), _jsx("h3", { tabIndex: -1, children: selected.title }), _jsx("p", { children: selected.summary })] }) }), _jsxs("div", { className: styles.detailMeta, "aria-label": "\u6269\u5C55\u4FE1\u606F", children: [_jsx("span", { children: selected.category }), _jsx("span", { children: typeLabel(selected) }), _jsx("span", { children: selected.enabled ? '已启用记录' : '已标记停用' }), selected.localTestOnly === true && _jsx("span", { children: "\u4EC5\u672C\u673A\u6D4B\u8BD5" })] }), _jsxs("div", { className: styles.detailIntro, children: [_jsx("span", { children: "\u5B83\u80FD\u505A\u4EC0\u4E48" }), _jsxs("p", { children: [EXTENSION_KIND_HINTS[selected.kind], " \u8FD9\u662F\u4F60\u81EA\u5DF1\u6DFB\u52A0\u7684\u5185\u5BB9\uFF0C\u4E0D\u5C5E\u4E8E DeepSeek Harness \u5B98\u65B9\u5185\u7F6E\u529F\u80FD\u3002"] })] }), _jsxs("div", { className: styles.repositoryCard, children: [_jsxs("div", { children: [_jsx("span", { className: styles.repositoryLabel, children: "\u9879\u76EE\u5730\u5740" }), _jsx("a", { className: styles.repositoryUrl, href: selected.repositoryUrl, target: "_blank", rel: "noreferrer", children: selected.repositoryUrl })] }), _jsx("a", { className: styles.repositoryButton, href: selected.repositoryUrl, target: "_blank", rel: "noreferrer", children: "\u6253\u5F00 GitHub" })] }), _jsxs("div", { className: styles.addMethod, children: [_jsx("span", { children: "\u672C\u673A\u5B89\u88C5\u4F4D\u7F6E" }), _jsx("p", { children: selected.localPath }), _jsx("small", { children: selected.kind === 'plugin'
                                            ? '移除后只会隐藏这条用户扩展记录；profile 依赖会保留，避免破坏当前 Harness 运行环境。'
                                            : '删除后只会移除这条用户扩展及其本地目录，不会删除官方 Harness 文件。' })] }), _jsxs("div", { className: styles.detailActions, children: [_jsx("button", { type: "button", className: styles.secondaryButton, onClick: onClose, children: "\u8FD4\u56DE\u804A\u5929" }), _jsx("button", { type: "button", className: styles.dangerButton, onClick: () => { void removeSelected(); }, children: selected.kind === 'plugin' ? '从我的扩展移除' : '从本机删除' })] })] }) })) : (_jsxs(_Fragment, { children: [_jsx("header", { className: styles.libraryHeader, children: _jsx("div", { children: _jsx("h2", { children: "\u6211\u7684\u6269\u5C55" }) }) }), _jsxs("div", { className: styles.filterRows, children: [_jsx("div", { className: styles.filterRow, role: "group", "aria-label": "\u6269\u5C55\u7C7B\u578B", children: _jsx("div", { children: ['all', 'skill', 'plugin'].map(item => (_jsx("button", { type: "button", "aria-pressed": kind === item, onClick: () => { setKind(item); }, children: item === 'all' ? '全部类型' : EXTENSION_KIND_LABELS[item] }, item))) }) }), _jsx("div", { className: styles.filterRow, role: "group", "aria-label": "\u6269\u5C55\u5206\u7C7B", children: _jsx("div", { children: categories.map(item => (_jsx("button", { type: "button", "aria-pressed": category === item, onClick: () => { setCategory(item); }, children: item === 'all' ? '全部分类' : item }, item))) }) })] }), loading ? (_jsxs("div", { className: styles.emptyState, children: [_jsx("span", { "aria-hidden": "true", children: "\u2301" }), _jsx("h3", { children: "\u6B63\u5728\u8BFB\u53D6\u672C\u673A\u6269\u5C55" }), _jsx("p", { children: "\u53EA\u8BFB\u53D6\u7528\u6237\u6269\u5C55\u767B\u8BB0\u518C\uFF0C\u4E0D\u4F1A\u626B\u63CF\u5B98\u65B9\u5185\u7F6E\u80FD\u529B\u3002" })] })) : error !== null ? (_jsxs("div", { className: styles.emptyState, role: "alert", children: [_jsx("span", { "aria-hidden": "true", children: "!" }), _jsx("h3", { children: "\u6682\u65F6\u8BFB\u4E0D\u5230\u672C\u673A\u6269\u5C55" }), _jsx("p", { children: error }), _jsx("button", { type: "button", className: styles.secondaryButton, onClick: () => { window.location.reload(); }, children: "\u91CD\u65B0\u8BFB\u53D6" })] })) : visibleExtensions.length === 0 ? (_jsxs("div", { className: styles.emptyState, children: [_jsx("span", { "aria-hidden": "true", children: "\u25C8" }), _jsx("h3", { children: extensions.length === 0 ? '还没有自己添加的扩展' : '没有找到匹配的扩展' }), _jsx("p", { children: extensions.length === 0 ? '从能力中心选择 Skill 或插件，按说明添加后，它们会出现在这里。' : '换个关键词，或者清除筛选条件。' }), extensions.length > 0 && _jsx("button", { type: "button", className: styles.secondaryButton, onClick: () => { setKind('all'); setCategory('all'); }, children: "\u6E05\u9664\u7B5B\u9009" })] })) : (_jsx("div", { className: styles.abilityGrid, "data-testid": "user-extension-grid", children: visibleExtensions.map(extension => extensionCard(extension, () => { setSelectedId(extension.id); })) }))] })) }), status.length > 0 && _jsx("p", { className: styles.status, role: "status", "aria-live": "polite", children: status })] }));
}
