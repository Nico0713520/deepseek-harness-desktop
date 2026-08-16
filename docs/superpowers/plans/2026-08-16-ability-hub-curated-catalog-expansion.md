# Ability Hub Curated Catalog Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Ability Hub from eight generic GitHub cards into a curated, evidence-labeled catalog of DeepSeek Harness recipes, Pi ecosystem references, and high-signal open-source tools across the supported industries.

**Architecture:** Keep the catalog local and read-only for the first release. Each card is one concrete Skill, MCP server, plugin, official Harness recipe, or Pi reference; metadata records ecosystem, trust tier, compatibility path, source URL, license, and popularity signal. The UI exposes the existing two filters, a compact search field, source/trust badges, and a detail panel with DSH-specific guidance. No remote installation or automatic execution is introduced.

**Tech Stack:** TypeScript, React, CSS Modules, Vitest, GitHub repository metadata verified with `gh`, Pi catalog evidence, DeepSeek Harness official documentation.

## Global Constraints

- The catalog recommends and teaches; it does not silently install third-party code.
- Every displayed project has a verified GitHub URL and a stated license or explicit license uncertainty.
- Pi extensions are labeled as Pi references or manual-adapter candidates, never as native DeepSeek Harness plugins.
- DSH official recipes link to official repository/docs and explain Creator Mode, Skill, MCP, preset, or UI extension paths.
- Use only the existing TypeScript/React/CSS stack; do not add a marketplace backend or new runtime dependency.
- Keep the white, compact, low-noise Ability Hub visual language and the separate industry/kind filters.

---

### Task 1: Add catalog provenance and compatibility metadata

**Files:**
- Modify: `packages/dsh-creator-center/src/client/catalog.ts`
- Test: `packages/dsh-creator-center/src/client/catalog.test.ts`

**Interfaces:**
- Add `ecosystem`, `trust`, `compatibility`, `popularity`, and optional `iconUrl` metadata to `AbilityDefinition`.
- Add display labels for trust and compatibility without changing existing `IndustryId` or `AbilityKindId` values.

- [ ] Add the metadata types and labels.
- [ ] Keep existing eight records valid by making new metadata optional or assigning safe defaults in one helper.
- [ ] Add tests proving every record has a GitHub URL, non-empty install guidance, a trust label, and a compatibility label after expansion.
- [ ] Run `npm test --workspace @deepseek-ai/dsh-creator-center -- catalog.test.ts` and confirm the old exact-count assertions are replaced with invariant checks.

### Task 2: Add the curated official, Pi, vendor, and industry catalog

**Files:**
- Create: `packages/dsh-creator-center/src/client/additional-catalog.ts`
- Modify: `packages/dsh-creator-center/src/client/catalog.ts`
- Test: `packages/dsh-creator-center/src/client/catalog.test.ts`

**Interfaces:**
- Export `ADDITIONAL_ABILITIES: readonly AbilityDefinition[]` from `additional-catalog.ts`.
- Compose it into `ABILITIES` after the existing verified records.

- [ ] Add official Harness recipe cards for creating a Skill, connecting MCP, customizing an Agent Preset, building a UI extension, and auditing/rolling back an extension.
- [ ] Add high-signal Pi cards such as `pi-mcp-adapter`, `pi-web-access`, `pi-subagents`, `pi-lens`, `pi-hermes-memory`, `pi-plan-mode`, `pi-ask-user`, and the maintainer `pi-skills` collection; label them `Pi 参考` and `需适配`.
- [ ] Add verified vendor/open-source cards for Playwright MCP, GitHub MCP, Context7, MarkItDown, Stripe AI, Shopify AI Toolkit, OpenBB, PaperQA, Google HCLS MCP, Sentry MCP, Firecrawl MCP, and DSH Vision Toolkit.
- [ ] Add individual maintainer Skill cards for the highest-value `pi-skills` entries: browser-tools, brave-search, transcribe, youtube-transcript, gccli, gdcli, and gmcli.
- [ ] Assign industry and ability-kind tags so each item is discoverable through the two existing filter rows.
- [ ] Add popularity signals as dated text, not fake live counters; use stars or Pi monthly downloads only when verified.
- [ ] Add tests for minimum catalog size, unique IDs, official recipe presence, each industry having at least one item, and all added URLs being GitHub URLs.

### Task 3: Make cards visually communicate source and compatibility

**Files:**
- Modify: `packages/dsh-creator-center/src/client/AbilityLibrary.tsx`
- Modify: `packages/dsh-creator-center/src/client/creator-center.module.css`
- Test: `packages/dsh-creator-center/src/client/CreatorCenter.test.tsx`

**Interfaces:**
- Render a GitHub owner avatar when the repository URL is a GitHub URL, with the existing initial marker as the accessible fallback.
- Render trust and compatibility badges without adding another filter row.

- [ ] Add a compact searchbox wired to `abilitiesFor({ industry, kind, query })`.
- [ ] Replace the current three-column oversized card rhythm with a compact responsive two-column layout that becomes three columns only on wide screens.
- [ ] Show one-line plain-language outcome, source ecosystem, trust tier, compatibility path, and dated popularity signal.
- [ ] Preserve the single primary action `查看方案`; keep details collapsed until selected.
- [ ] Add empty-state copy that explains how to broaden search and never implies that the project was installed.
- [ ] Add tests for search filtering, trust/compatibility labels, and repository links.

### Task 4: Expand detail guidance for small users

**Files:**
- Modify: `packages/dsh-creator-center/src/client/AbilityDetail.tsx`
- Modify: `packages/dsh-creator-center/src/client/prompt.ts`
- Test: `packages/dsh-creator-center/src/client/AbilityDetail.test.tsx` (create if needed)

**Interfaces:**
- Detail view consumes the new provenance metadata and displays `适配方式`, `来源生态`, `可信度`, `许可证`, and `使用量信号`.
- Creation prompt must tell Harness whether to copy a Skill, configure MCP, create a preset, or manually adapt a Pi extension.

- [ ] Add a beginner summary before advanced technical fields.
- [ ] For Pi references, explicitly say “不能直接安装到 DeepSeek Harness；请按 DSH 机制重写或寻找对应 MCP/Skill 版本”.
- [ ] For official Harness recipes, link to the official docs and explain the expected Creator Mode safety checks.
- [ ] Keep copy-before-create behavior and never auto-send or auto-run third-party code.

### Task 5: Verify and package the catalog

**Files:**
- Modify: `docs/superpowers/specs/2026-08-16-ability-hub-open-source-catalog-design.md`
- Modify: `docs/superpowers/plans/2026-08-16-ability-hub-open-source-catalog.md`

- [ ] Record the curated source groups, evidence date, and known limitations.
- [ ] Run `npm test --workspace @deepseek-ai/dsh-creator-center`.
- [ ] Run `npm run typecheck --workspace @deepseek-ai/dsh-creator-center`.
- [ ] Run `npm run build --workspace @deepseek-ai/dsh-creator-center`.
- [ ] Inspect the rendered Ability Hub at desktop and narrow widths; check filter/search, card density, avatar fallback, details, and GitHub links.
- [ ] Review the diff for accidental installation behavior or unverified project claims.

