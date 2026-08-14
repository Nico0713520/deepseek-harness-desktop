# Extension decision tree

Choose the least invasive type that can reliably deliver the result.

1. If stable written guidance, examples, and checks are enough, choose a **Skill**. It is a reusable playbook the AI loads when relevant.
2. If the user needs a named specialist with a stable persona, selected tools, and one or more Skills, choose an **Agent preset**.
3. If multiple fixed steps must run in order, on a schedule, or under a condition, choose a **workflow**.
4. If code must connect a new service, tool, protocol, or host capability, choose a **plugin**.
5. If the result adds Settings, visual decoration, or another surface while preserving official chat controls, choose a **UI extension**.

Prefer one extension over a bundle. Combine types only when each type has a separate responsibility, such as an Agent preset that loads a reusable SOP Skill.

## Recommendation format

For each option use:

- `你会得到`
- `扩展类型`
- `为什么适合`
- `需要权限`
- `难度`
- `验证方法`
- `撤销方法`

Recommend one primary option and no more than two alternatives.
