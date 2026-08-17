# Work Board

The active coordinator assigns one owner and one branch to every task. A task must have a clear file boundary and an independently runnable test before it is assigned.

## CODEX_CORE

| ID | Task | Owner | Branch | Owned area | Depends on | Status |
|---|---|---|---|---|---|---|
| DX-001 | Stabilize the current official Cordis and Extension Center baseline | Codex | `agent/deepseek-harness-collaboration` | Electron lifecycle, creator launch integration, release scripts | none | in progress |
| DX-002 | Review and integrate worker pull requests | Codex | `main` | merge and release surfaces | DX-001 | pending |

## COMPANY_HANA

| ID | Task | Owner | Branch | Owned area | Depends on | Status |
|---|---|---|---|---|---|---|
| CH-001 | Audit catalog quality, classification, URLs, copy, and static star snapshots | Company Hana | `agent/company-hana/catalog-audit` | catalog data, catalog tests, source ledger | DX-001 | pending |

## HOME_HANA

| ID | Task | Owner | Branch | Owned area | Depends on | Status |
|---|---|---|---|---|---|---|
| HH-001 | Verify Windows install, launch, hidden-console behavior, and packaged smoke test | Home Hana | `agent/home-hana/windows-verification` | Windows scripts and Windows-specific tests | accepted baseline | pending |

## BLOCKED

| ID | Problem | Waiting for | Owner | Status |
|---|---|---|---|---|
| — | No current blocker recorded | — | — | — |

## Ownership rule

If a task needs a file outside its owned area, the agent must stop and update the task or ask the active coordinator. The coordinator owns changes that affect multiple modules.
