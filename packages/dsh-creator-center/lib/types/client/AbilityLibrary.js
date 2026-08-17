import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { ABILITY_KINDS, ABILITY_KIND_LABELS, DEVELOPER_DIRECTIONS, DEVELOPER_DIRECTION_LABELS, EXTENSION_TYPE_LABELS, githubStarLabel, INDUSTRIES, INDUSTRY_LABELS, } from "./catalog.js";
import { AbilityDetail } from "./AbilityDetail.js";
import { PROJECT_LOGO_CELL_SIZE, PROJECT_LOGO_COLUMNS, PROJECT_LOGO_INDEX, PROJECT_LOGO_ROWS, PROJECT_LOGO_SPRITE, } from "./project-logos.js";
import styles from './creator-center.module.css';
function projectMonogram(title) {
    const projectName = title.split('/').at(-1)?.trim() ?? title.trim();
    const firstVisible = [...projectName][0] ?? [...title.trim()][0] ?? '·';
    return firstVisible.toLocaleUpperCase();
}
function repositoryOwner(repositoryUrl) {
    if (repositoryUrl === undefined)
        return undefined;
    return /^https:\/\/github\.com\/([^/]+)/i.exec(repositoryUrl)?.[1]?.toLowerCase();
}
function localProjectLogo(owner) {
    if (owner === undefined)
        return undefined;
    const index = PROJECT_LOGO_INDEX[owner];
    if (index === undefined)
        return undefined;
    const column = index % PROJECT_LOGO_COLUMNS;
    const row = Math.floor(index / PROJECT_LOGO_COLUMNS);
    return {
        backgroundImage: `url("${PROJECT_LOGO_SPRITE}")`,
        backgroundPosition: `${-column * PROJECT_LOGO_CELL_SIZE}px ${-row * PROJECT_LOGO_CELL_SIZE}px`,
        backgroundSize: `${PROJECT_LOGO_COLUMNS * PROJECT_LOGO_CELL_SIZE}px ${PROJECT_LOGO_ROWS * PROJECT_LOGO_CELL_SIZE}px`,
    };
}
export function AbilityLibrary({ abilities, allAbilities, industry, kind, developerDirection, selectedId, creatorDisabled, onIndustryChange, onKindChange, onDeveloperDirectionChange, onSelect, onClear, onCreate, onAskAdvisor, }) {
    const selected = allAbilities.find(item => item.id === selectedId);
    const detailRef = useRef(null);
    useEffect(() => {
        if (selected === undefined)
            return;
        const frame = window.requestAnimationFrame(() => {
            const target = detailRef.current;
            if (target !== null && typeof target.scrollIntoView === 'function') {
                target.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
            target?.querySelector('h3')?.focus();
        });
        return () => { window.cancelAnimationFrame(frame); };
    }, [selected]);
    useEffect(() => {
        if (selected === undefined)
            return;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape')
                onSelect(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => { window.removeEventListener('keydown', handleKeyDown); };
    }, [onSelect, selected]);
    return (_jsx("section", { className: `${styles.library} ${selected === undefined ? '' : styles.libraryDetailMode}`, "aria-label": "\u80FD\u529B Hub", "data-layout": selected === undefined ? 'list' : 'detail', children: selected !== undefined ? (_jsx("div", { ref: detailRef, className: styles.detailPage, children: _jsx(AbilityDetail, { ability: selected, disabled: creatorDisabled, onBack: () => { onSelect(null); }, onCreate: onCreate, onAskAdvisor: onAskAdvisor }) })) : (_jsxs(_Fragment, { children: [_jsx("header", { className: styles.libraryHeader, children: _jsx("div", { children: _jsx("h2", { children: "\u80FD\u529B\u5E93" }) }) }), _jsxs("div", { className: styles.filterRows, children: [_jsx("div", { className: styles.filterRow, role: "group", "aria-label": "\u884C\u4E1A\u5206\u7C7B", children: _jsx("div", { children: INDUSTRIES.map(item => (_jsx("button", { type: "button", "aria-pressed": industry === item.id, onClick: () => { onIndustryChange(item.id); }, children: item.label }, item.id))) }) }), industry === 'programmer' ? (_jsx("div", { className: styles.filterRow, role: "group", "aria-label": "\u5F00\u53D1\u65B9\u5411", children: _jsx("div", { children: DEVELOPER_DIRECTIONS.map(item => (_jsx("button", { type: "button", "aria-pressed": developerDirection === item.id, title: item.description, onClick: () => { onDeveloperDirectionChange(item.id); }, children: item.label }, item.id))) }) })) : (_jsx("div", { className: styles.filterRow, role: "group", "aria-label": "\u80FD\u529B\u79CD\u7C7B", children: _jsx("div", { children: ABILITY_KINDS.map(item => (_jsx("button", { type: "button", "aria-pressed": kind === item.id, onClick: () => { onKindChange(item.id); }, children: item.label }, item.id))) }) }))] }), abilities.length === 0 ? (_jsxs("div", { className: styles.emptyState, children: [_jsx("span", { "aria-hidden": "true", children: "\u2301" }), _jsx("h3", { children: "\u6CA1\u6709\u627E\u5230\u5B8C\u5168\u5339\u914D\u7684\u80FD\u529B" }), _jsx("p", { children: "\u6362\u4E2A\u8BF4\u6CD5\uFF0C\u6216\u8005\u5148\u6E05\u9664\u884C\u4E1A\u548C\u7B5B\u9009\u6761\u4EF6\u3002" }), _jsxs("div", { children: [_jsx("button", { type: "button", className: styles.secondaryButton, onClick: onClear, children: "\u6E05\u9664\u7B5B\u9009" }), _jsx("button", { type: "button", className: styles.textButton, onClick: onAskAdvisor, children: "\u8BA9 AI \u5E2E\u6211\u5B9A\u5236" })] })] })) : (_jsx("div", { className: styles.abilityGrid, "data-testid": "ability-grid", children: abilities.map(ability => {
                        const cardIndustry = industry !== 'all' && ability.industryIds.includes(industry)
                            ? industry
                            : ability.industryIds[0];
                        const primaryDirection = ability.developerDirectionIds[0];
                        const isPiExtension = ability.ecosystem === 'pi';
                        const isOfficialCapability = ability.implementation.repositoryUrl === undefined && ability.implementation.sourceUrl !== undefined;
                        const logoOwner = repositoryOwner(ability.implementation.repositoryUrl);
                        const logoStyle = localProjectLogo(logoOwner);
                        const openAbility = () => {
                            onSelect(selectedId === ability.id ? null : ability.id);
                        };
                        return (_jsxs("article", { className: `${styles.abilityCard} ${selectedId === ability.id ? styles.abilityCardSelected : ''}`, "data-testid": "ability-card", tabIndex: 0, "aria-label": `打开“${ability.title}”详情`, onClick: openAbility, onKeyDown: event => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openAbility();
                                }
                            }, children: [_jsxs("div", { className: styles.cardTopline, children: [_jsx("div", { className: styles.cardMarker, "aria-hidden": "true", "data-project-logo-owner": logoOwner, "data-ecosystem": ability.ecosystem, "data-has-logo": logoStyle === undefined ? undefined : 'true', style: logoStyle, children: _jsx("span", { children: projectMonogram(ability.title) }) }), _jsxs("div", { className: styles.cardBadges, children: [_jsx("span", { className: styles.cardStars, title: ability.popularity ?? 'GitHub Star 未同步', children: githubStarLabel(ability.popularity) }), _jsx("span", { children: EXTENSION_TYPE_LABELS[ability.implementation.extensionTypes[0]] })] })] }), _jsx("h3", { children: ability.title }), _jsx("p", { className: styles.cardOutcome, children: ability.outcome }), _jsx("p", { className: styles.cardSummary, children: ability.summary }), _jsxs("div", { className: styles.cardSourceLine, children: [_jsx("span", { children: isPiExtension ? 'Pi 扩展' : (isOfficialCapability ? 'Codex 官方能力' : (primaryDirection === undefined ? '通用能力' : DEVELOPER_DIRECTION_LABELS[primaryDirection])) }), _jsx("span", { children: isPiExtension ? '高级开发者学习' : (isOfficialCapability ? '官方运行时' : 'GitHub 项目') })] }), _jsxs("footer", { className: styles.cardFooter, children: [_jsxs("div", { className: styles.cardTags, children: [_jsx("span", { children: ABILITY_KIND_LABELS[ability.kindIds[0]] }), cardIndustry !== undefined && industry === 'all' && _jsx("span", { children: INDUSTRY_LABELS[cardIndustry] })] }), _jsxs("button", { type: "button", "aria-expanded": selectedId === ability.id, "aria-label": `查看“${ability.title}”方案`, onClick: event => { event.stopPropagation(); openAbility(); }, children: ["\u67E5\u770B\u65B9\u6848 ", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] })] })] }, ability.id));
                    }) }))] })) }));
}
