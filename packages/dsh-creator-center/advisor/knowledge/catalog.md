# Beginner catalog and sources

## Seed ideas

| Need | Recommended type | Minimum acceptance check |
| --- | --- | --- |
| Weekly report | Skill | Uses a real note set and never invents missing data |
| Company SOP assistant | Agent preset + Skill | Stops at every human-approval boundary |
| Web research brief | Agent preset | Compares independent sources and links key claims |
| File/data analysis | Skill | Preserves originals and reports calculation rules |
| GitHub code review | Agent preset + Skill | Findings include severity, location, and evidence |
| Project scaffolding | Agent preset | Creates a temporary minimum example and runs its check |
| Scheduled check | Workflow | Shows timezone, next run, manual test, pause, and delete |
| Custom UI/theme | UI extension/plugin | Disabling it restores the official UI |

This seed catalog is deliberately local and small. Future repositories and tutorials can be added as reviewed entries without changing the conversation contract.

## Source labels

- Official Harness repository: https://github.com/deepseek-ai/deepseek-harness — official source; MIT license in the repository root; prefer its current preset, Skill, workflow, and plugin documentation.
- Community UI example: https://github.com/zhu1090093659/dsh-web-ui — community-maintained; license not yet confirmed in this catalog, so use only general ideas until it is reviewed.

Never claim that a community item is official, safe, compatible, or installable until its repository, version, permissions, and license have been checked.

## Beginner troubleshooting

- **The preset did not open:** keep Settings open, copy the visible prompt manually, and select official `创造模式` from the new-session preset menu.
- **Creation asks to edit official source:** stop and request a user-owned Skill, preset, workflow, plugin, or project directory instead.
- **The result cannot be verified:** ask for one real input and a deterministic command or checklist before enabling it.
- **A repository has no clear license:** do not copy code or assets; summarize the general pattern and wait for a reviewed alternative.
- **An install asks for credentials or a remote script:** explain why it is needed and obtain separate explicit approval.
