# Whale Canvas Theme and Dual Pet Design

**Status:** Approved direction from the 2026-08-15 conversation; prototype artwork may use the user's supplied reference images unchanged. Public release artwork remains a separate licensing and originality gate.

## Goal

Add a reversible Whale Canvas appearance package to DeepSeek Harness Whale Desktop without redesigning the official chat controls. Theme switching lives only in Settings. The first prototype uses the supplied whale-maid character appearance and two supplied pet concepts so the complete theme and pet pipeline can be verified before final artwork is commissioned or redrawn.

## Scope Boundary

This slice includes:

- a new `Theme & Pets` entry inside the official Settings experience;
- one persisted Whale Canvas on/off switch;
- Official Default and Whale Canvas appearance states;
- a scoped conversation-canvas background and decorative artwork;
- Whale Maid and Abstract Whale pet choices, plus Off;
- complete reset to the official UI when the theme is disabled or loading fails;
- prototype-only asset provenance records;
- packaged macOS verification and source-level Windows verification.

This slice does not include:

- a theme button or pet button in the chat canvas;
- changes to the official sidebar, top bar, conversation tabs, message composer, model selector, or status bar;
- a public theme marketplace;
- Live2D, voice, sound effects, affinity, feeding, or pet growth;
- final redistribution approval for the supplied online artwork;
- the Capability Center, Skill catalog, or extension tutorials. Those form the next independent slice.

## Chosen Approach

Implement a dedicated DSH client plugin using the official Cordis/UI extension seams. Reuse the lifecycle ideas from the Apache-2.0 `dsh-web-ui` skin center and pet packages: settings registration, persisted configuration, apply/reset disposers, state observation, and package mounting. Do not keep the existing Whale Song package as the final theme because it changes global body styles and official UI regions outside the approved scope.

The plugin applies only plugin-owned layers and stable semantic targets. It may anchor to `[data-conversation-scroll]` for the conversation canvas and must explicitly exclude `[data-composer-card]`. It must not depend on hashed CSS-module class names.

## Settings Experience

Settings gains one left-navigation item named `主题与桌宠` beneath the existing Agent preset section. The page has three compact sections:

1. **鲸鱼主题** — a single switch labeled `使用鲸鱼画布`; switching it off immediately and completely restores Official Default.
2. **桌宠** — a three-option segmented control: `关闭`, `鲸鱼女仆`, `抽象鲸鱼`.
3. **显示设置** — pet scale (`80%`, `100%`, `120%`), reset position, and a `恢复官方外观` safety action.

The switch is the only normal theme-toggle interaction. No floating theme control appears in the chat area. Changes apply immediately and persist through the DSH settings service. A small preview thumbnail is decorative, not a second apply mechanism.

## Whale Canvas Visual Design

The visual direction is `冰蓝女仆工作台`.

### Preserved official regions

- left workspace sidebar;
- top header and conversation/trajectory tabs;
- message composer and all controls inside it;
- model and reasoning controls;
- session status and token statistics;
- settings dialog chrome outside the plugin's own page.

These regions retain official tokens, spacing, borders, and interaction behavior.

### Themed conversation region

The conversation canvas receives four isolated layers from back to front:

1. **Atmosphere:** a pale ice-blue to white gradient with a subtle palace-window and underwater-light texture. It remains static when reduced motion is enabled.
2. **Left character:** the supplied whale-maid appearance, approximately 26–32% of the conversation width, anchored to the lower-left edge. The face and silhouette remain visible, while the body may extend below the viewport.
3. **Right decorations:** one smaller whale-maid or whale illustration at the upper-right/lower-right safe margins. It cannot overlap the right panel, scroll bar, composer, or message actions.
4. **Reading veil:** a centered translucent white veil behind the message stream, using official radius and shadow tokens. Text contrast must remain WCAG AA for normal body text.

The initial prototype may use the supplied images without redrawing the character. CSS clipping, object positioning, masks, and translucent edge fades may remove visible white rectangles from the layout, but must not distort the face. Images containing large captions are not used as full-canvas backgrounds; they may be cropped to the character-only region for the private prototype.

The theme adds no new ornamental frame around the composer. Gold lines, bows, and lace may appear only in the background/decorative layers and must remain visually subordinate to messages.

## Pet Design

The pet is mounted through the global shell overlay so it remains visible across normal Harness pages, but its controls live in Settings.

### Pet packs

- `whale-maid`: uses the supplied chibi whale-maid appearance.
- `abstract-whale`: uses the supplied blue, round, smiling abstract whale.

Each prototype pack uses a transparent or masked still image and maps Harness activity to lightweight CSS motion:

| Harness activity | Prototype motion |
| --- | --- |
| idle | slow two-pixel breathing float |
| thinking | gentle left-right sway |
| tool execution | short forward bob loop |
| waiting | pause with one small pulse |
| completed | one jump and settle |
| failed | brief tilt and settle |

The pet can be dragged only by direct pointer interaction. Its position, scale, and selected pack persist. The renderer clamps the pet inside the usable window after resizing and keeps it out of the composer by default. Apart from the pet's hit area, the overlay uses `pointer-events: none`.

The data contract supports later animated sprites without changing settings or activity mapping:

```ts
type PetPack = {
  id: 'whale-maid' | 'abstract-whale'
  label: string
  renderer: 'still' | 'spritesheet'
  asset: string
  defaultScale: number
  attribution: AssetAttribution
}
```

## State and Recovery

The plugin owns one persisted configuration object:

```ts
type WhaleAppearanceSettings = {
  themeEnabled: boolean
  pet: 'off' | 'whale-maid' | 'abstract-whale'
  petScale: 0.8 | 1 | 1.2
  petPosition?: { x: number; y: number }
}
```

Applying the theme returns a disposer that removes every plugin-owned DOM node, data attribute, event listener, and style sheet. Disabling the theme, unloading the plugin, or catching an apply error always runs the same disposer. Pet failure never prevents the official chat UI from loading.

The safety action `恢复官方外观` sets `themeEnabled` to false, sets `pet` to `off`, clears saved pet coordinates, disposes all visual layers, and then reloads only if stale plugin-owned nodes remain.

## Prototype Asset Policy

The supplied images are copied into a clearly marked `prototype` asset directory with source filenames, SHA-256 values, and the note `private prototype; public redistribution not cleared`. They may be used in local development builds requested by the user.

Release automation must reject public release artifacts while any bundled asset has `redistribution: prototype-only`. Before publishing to GitHub Releases, those assets must be replaced by original, commissioned, or explicitly licensed equivalents. Character appearance can remain the visual reference, but redistribution rights are handled independently from code licensing.

## Test Strategy

Unit tests cover:

- persisted settings defaults and updates;
- theme apply/dispose idempotency;
- official-region selector denylist;
- pet activity-to-motion mapping;
- pet position clamping;
- prototype-only release gate;
- bundled plugin provisioning into the actual desktop profile.

A DOM integration fixture verifies:

- the Settings entry is visible;
- enabling Whale Canvas creates only conversation-canvas layers;
- the composer, sidebar, and header receive no theme-owned attributes or inline styles;
- disabling the switch restores the captured official state;
- selecting either pet changes the overlay asset and survives reload.

Packaged smoke verification on macOS confirms the installed application, not only `pnpm start`, shows the Settings entry and can toggle the theme. Windows CI verifies packaging, profile provisioning, and the renderer bundle until a Windows visual runner is available.

## Acceptance Criteria

- Theme switching exists only under `设置 > 主题与桌宠`.
- One switch reliably changes between Whale Canvas and the official appearance.
- Sidebar, header, tabs, composer, model controls, and status bar remain official.
- The conversation canvas visibly uses the approved whale-maid appearance.
- Whale Maid and Abstract Whale can each be selected as the pet, dragged, scaled, hidden, and restored after restart.
- Theme or pet failures recover to a usable official UI without deleting conversations or user-installed plugins.
- The packaged Mac app mounts the visual plugin into the profile it actually starts.
- Public release builds cannot accidentally ship prototype-only art.

## Delivery Order

1. Fix and test bundled-plugin provisioning in the packaged desktop profile.
2. Introduce the local TypeScript/React appearance plugin and its settings contract.
3. Add the Settings entry and official appearance reset path.
4. Implement the scoped Whale Canvas layers with prototype artwork.
5. Add the still-image pet renderer, both pet packs, persistence, and drag/scale behavior.
6. Run DOM integration, packaged macOS smoke, and Windows package checks.
7. Replace prototype-only art before any public GitHub Release.

