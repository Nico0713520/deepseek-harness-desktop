window.__ModuleLoader__.load({
	id: "@whale-desktop/dsh-whale-appearance",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region dsh-css:settings-card.module.css
		const css$2 = ".FTIlia_card{border:1px solid var(--dsw-alias-border-l2,#dfe3ea);background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-text-primary,#182230);border-radius:14px;padding:18px;list-style:none}.FTIlia_header{align-items:flex-start;gap:12px;margin-bottom:16px;display:flex}.FTIlia_icon{background:#e9f4ff;border-radius:12px;place-items:center;width:38px;height:38px;font-size:20px;display:grid}.FTIlia_title{font-size:15px;display:block}.FTIlia_description{color:var(--dsw-alias-text-secondary,#687385);margin-top:3px;font-size:12px;display:block}.FTIlia_section{border-top:1px solid var(--dsw-alias-border-l1,#edf0f4);justify-content:space-between;align-items:center;gap:16px;padding:13px 0;display:flex}.FTIlia_section p{color:var(--dsw-alias-text-secondary,#687385);margin:4px 0 0;font-size:12px}.FTIlia_switch{cursor:pointer;background:#c7ced8;border:0;border-radius:999px;width:46px;height:26px;padding:3px;transition:background .14s}.FTIlia_switch span{background:#fff;border-radius:50%;width:20px;height:20px;transition:transform .14s;display:block;box-shadow:0 1px 4px #0003}.FTIlia_switchOn{background:#4d79df}.FTIlia_switchOn span{transform:translate(20px)}.FTIlia_block{border-top:1px solid var(--dsw-alias-border-l1,#edf0f4);padding:12px 0}.FTIlia_block>strong{margin-bottom:9px;font-size:13px;display:block}.FTIlia_segmented{flex-wrap:wrap;gap:8px;display:flex}.FTIlia_segmented button,.FTIlia_footer button{border:1px solid var(--dsw-alias-border-l2,#d8dde6);background:var(--dsw-alias-bg-base,#fff);color:inherit;cursor:pointer;border-radius:9px;padding:7px 11px}.FTIlia_segmented button:hover,.FTIlia_footer button:hover{border-color:#7da4ee}.FTIlia_segmented .FTIlia_selected{color:#315eb8;background:#edf4ff;border-color:#4d79df}.FTIlia_footer{border-top:1px solid var(--dsw-alias-border-l1,#edf0f4);justify-content:space-between;gap:10px;padding-top:13px;display:flex}.FTIlia_footer .FTIlia_restore{color:#315eb8;border-color:#9bb8ed}.FTIlia_error{color:#c93636;margin:10px 0 0;font-size:12px}.FTIlia_card button:focus-visible{outline-offset:2px;outline:2px solid #4d79df}.FTIlia_card button:disabled{opacity:.55;cursor:wait}@media (prefers-reduced-motion:reduce){.FTIlia_switch,.FTIlia_switch span{transition:none}}";
		const tagId$2 = "@whale-desktop/dsh-whale-appearance/settings-card.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@whale-desktop/dsh-whale-appearance";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var settings_card_module_css_default = {
			"block": "FTIlia_block",
			"card": "FTIlia_card",
			"description": "FTIlia_description",
			"error": "FTIlia_error",
			"footer": "FTIlia_footer",
			"header": "FTIlia_header",
			"icon": "FTIlia_icon",
			"restore": "FTIlia_restore",
			"section": "FTIlia_section",
			"segmented": "FTIlia_segmented",
			"selected": "FTIlia_selected",
			"switch": "FTIlia_switch",
			"switchOn": "FTIlia_switchOn",
			"title": "FTIlia_title"
		};
		//#endregion
		//#region src/client/AppearanceSettingsCard.tsx
		const PETS = [
			{
				id: "off",
				label: "关闭"
			},
			{
				id: "whale-maid",
				label: "鲸鱼女仆"
			},
			{
				id: "abstract-whale",
				label: "抽象鲸鱼"
			}
		];
		const SCALES = [
			.8,
			1,
			1.2
		];
		function AppearanceSettingsCard({ controller }) {
			const snapshot = (0, react.useSyncExternalStore)(controller.subscribe, controller.getSnapshot);
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const update = (patch) => {
				setBusy(true);
				setError(null);
				controller.patch(patch).catch(() => {
					setError("保存失败，已保留当前外观。");
				}).finally(() => {
					setBusy(false);
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_css_default.card,
				"data-whale-settings-card": true,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: settings_card_module_css_default.header,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.icon,
							"aria-hidden": "true",
							children: "🐋"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", {
							className: settings_card_module_css_default.title,
							children: "主题与桌宠"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.description,
							children: "只装饰聊天画布，官方侧栏和输入框保持不变。"
						})] })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: settings_card_module_css_default.section,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "鲸鱼主题" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: snapshot.themeEnabled ? "鲸鱼画布" : "官方外观" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${settings_card_module_css_default.switch} ${snapshot.themeEnabled ? settings_card_module_css_default.switchOn : ""}`,
							"aria-label": snapshot.themeEnabled ? "恢复官方外观" : "使用鲸鱼画布",
							"aria-pressed": snapshot.themeEnabled,
							disabled: busy,
							onClick: () => {
								update({ themeEnabled: !snapshot.themeEnabled });
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {})
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: settings_card_module_css_default.block,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "桌宠" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: settings_card_module_css_default.segmented,
							children: PETS.map((pet) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": snapshot.pet === pet.id,
								className: snapshot.pet === pet.id ? settings_card_module_css_default.selected : "",
								disabled: busy,
								onClick: () => {
									update({ pet: pet.id });
								},
								children: pet.label
							}, pet.id))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: settings_card_module_css_default.block,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "桌宠大小" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: settings_card_module_css_default.segmented,
							children: SCALES.map((scale) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": snapshot.petScale === scale,
								className: snapshot.petScale === scale ? settings_card_module_css_default.selected : "",
								disabled: busy,
								onClick: () => {
									update({ petScale: scale });
								},
								children: [Math.round(scale * 100), "%"]
							}, scale))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
						className: settings_card_module_css_default.footer,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy,
							onClick: () => {
								update({ petPosition: {
									right: 24,
									bottom: 24
								} });
							},
							children: "重置桌宠位置"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: settings_card_module_css_default.restore,
							disabled: busy,
							onClick: () => {
								update({
									themeEnabled: false,
									pet: "off",
									petScale: 1,
									petPosition: {
										right: 24,
										bottom: 24
									}
								});
							},
							children: "恢复官方外观"
						})]
					}),
					error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: settings_card_module_css_default.error,
						role: "alert",
						children: error
					})
				]
			});
		}
		//#endregion
		//#region src/client/appearance-controller.ts
		const EMPTY = {
			themeEnabled: false,
			pet: "off",
			petScale: 1,
			petPosition: {
				right: 24,
				bottom: 24
			},
			activity: "idle"
		};
		var AppearanceController = class {
			fetcher;
			snapshot = EMPTY;
			listeners = /* @__PURE__ */ new Set();
			constructor(fetcher = globalThis.fetch.bind(globalThis)) {
				this.fetcher = fetcher;
			}
			getSnapshot = () => this.snapshot;
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			publish(snapshot) {
				this.snapshot = snapshot;
				for (const listener of this.listeners) listener();
				return snapshot;
			}
			async refresh() {
				const response = await this.fetcher("/api/whale-appearance/state");
				if (!response.ok) throw new Error(`appearance state failed: ${response.status}`);
				return this.publish(await response.json());
			}
			async patch(patch) {
				const response = await this.fetcher("/api/whale-appearance/config", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(patch)
				});
				if (!response.ok) throw new Error(`appearance config failed: ${response.status}`);
				return this.publish(await response.json());
			}
		};
		//#endregion
		//#region dsh-css:whale-theme.module.css
		const css$1 = "[data-conversation-scroll][data-whale-canvas-root]{isolation:isolate;background:#f7fbff;position:relative}[data-conversation-scroll][data-whale-canvas-root]>:not([data-whale-canvas]){z-index:2;position:relative}.rPFIda_layer{z-index:0;pointer-events:none;position:absolute;inset:0}.rPFIda_wallpaper{filter:saturate(1.04)drop-shadow(0 20px 34px #2f5faa29);opacity:.34;background:url(/whale-appearance/assets/abstract-whale.jpg) bottom/contain no-repeat;width:clamp(300px,34vw,520px);height:min(68vh,620px);inset:auto clamp(28px,5vw,84px) clamp(88px,13vh,144px) auto}[data-ds-dark-theme] [data-conversation-scroll][data-whale-canvas-root]{background:#0b1729}[data-ds-dark-theme] .rPFIda_wallpaper{opacity:.25;filter:saturate(.92)brightness(.72)drop-shadow(0 20px 34px #0000004d)}@media (width<=900px){.rPFIda_wallpaper{opacity:.22;width:min(72vw,360px);height:56vh;bottom:92px;right:-3vw}}@media (prefers-reduced-motion:reduce){.rPFIda_layer{transition:none}}";
		const tagId$1 = "@whale-desktop/dsh-whale-appearance/whale-theme.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@whale-desktop/dsh-whale-appearance";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var whale_theme_module_css_default = {
			"layer": "rPFIda_layer",
			"wallpaper": "rPFIda_wallpaper"
		};
		//#endregion
		//#region src/client/theme.ts
		const ROOT_SELECTOR = "[data-conversation-scroll]";
		function layer(doc) {
			const element = doc.createElement("div");
			element.dataset.whaleCanvas = "wallpaper";
			element.className = `${whale_theme_module_css_default.layer} ${whale_theme_module_css_default.wallpaper}`;
			element.setAttribute("aria-hidden", "true");
			return element;
		}
		function applyWhaleCanvas(doc = document) {
			let disposed = false;
			let mountedRoot = null;
			const clear = () => {
				for (const element of doc.querySelectorAll("[data-whale-canvas]")) element.remove();
				if (mountedRoot !== null) delete mountedRoot.dataset.whaleCanvasRoot;
				mountedRoot = null;
			};
			const mount = () => {
				if (disposed) return;
				const root = doc.querySelector(ROOT_SELECTOR);
				if (root === mountedRoot && root?.querySelectorAll("[data-whale-canvas]").length === 1) return;
				clear();
				if (root === null) return;
				root.dataset.whaleCanvasRoot = "";
				root.prepend(layer(doc));
				mountedRoot = root;
			};
			mount();
			const observer = new MutationObserver(mount);
			if (doc.body !== null) observer.observe(doc.body, {
				childList: true,
				subtree: true
			});
			return () => {
				if (disposed) return;
				disposed = true;
				observer.disconnect();
				clear();
			};
		}
		//#endregion
		//#region dsh-css:pet.module.css
		const css = ".ARiF9a_overlay{z-index:40;pointer-events:none;position:absolute;inset:0;overflow:hidden}.ARiF9a_pet{pointer-events:auto;touch-action:none;user-select:none;cursor:grab;transform-origin:50% 85%;filter:drop-shadow(0 12px 18px #23467d3d);position:absolute}.ARiF9a_pet:active{cursor:grabbing}.ARiF9a_pet img{object-fit:contain;mix-blend-mode:multiply;-webkit-user-drag:none;border-radius:24%;width:100%;height:100%}.ARiF9a_idle{animation:3.4s ease-in-out infinite ARiF9a_pet-breathe}.ARiF9a_thinking{animation:1.15s ease-in-out infinite ARiF9a_pet-sway}.ARiF9a_tool{animation:.72s ease-in-out infinite ARiF9a_pet-bob}.ARiF9a_waiting{animation:1.8s ease-in-out infinite ARiF9a_pet-pulse}.ARiF9a_completed{animation:.8s ease-out ARiF9a_pet-jump}.ARiF9a_failed{animation:.8s ease-out ARiF9a_pet-tilt}@keyframes ARiF9a_pet-breathe{0%,to{transform:translateY(0)scale(1)}50%{transform:translateY(-3px)scale(1.012)}}@keyframes ARiF9a_pet-sway{0%,to{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}@keyframes ARiF9a_pet-bob{0%,to{transform:translate(0)}50%{transform:translate(-7px)}}@keyframes ARiF9a_pet-pulse{0%,to{transform:scale(1)}50%{transform:scale(1.04)}}@keyframes ARiF9a_pet-jump{0%{transform:translateY(0)}42%{transform:translateY(-24px)scale(1.04)}to{transform:translateY(0)}}@keyframes ARiF9a_pet-tilt{0%,to{transform:rotate(0)}35%{transform:rotate(-8deg)}70%{transform:rotate(4deg)}}@media (prefers-reduced-motion:reduce){.ARiF9a_pet{animation:none}}";
		const tagId = "@whale-desktop/dsh-whale-appearance/pet.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@whale-desktop/dsh-whale-appearance";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var pet_module_css_default = {
			"completed": "ARiF9a_completed",
			"failed": "ARiF9a_failed",
			"idle": "ARiF9a_idle",
			"overlay": "ARiF9a_overlay",
			"pet": "ARiF9a_pet",
			"pet-bob": "ARiF9a_pet-bob",
			"pet-breathe": "ARiF9a_pet-breathe",
			"pet-jump": "ARiF9a_pet-jump",
			"pet-pulse": "ARiF9a_pet-pulse",
			"pet-sway": "ARiF9a_pet-sway",
			"pet-tilt": "ARiF9a_pet-tilt",
			"thinking": "ARiF9a_thinking",
			"tool": "ARiF9a_tool",
			"waiting": "ARiF9a_waiting"
		};
		//#endregion
		//#region src/client/WhalePet.tsx
		const ASSETS = {
			"whale-maid": {
				src: "/whale-appearance/assets/whale-maid.jpg",
				alt: "鲸鱼女仆桌宠"
			},
			"abstract-whale": {
				src: "/whale-appearance/assets/abstract-whale.jpg",
				alt: "抽象鲸鱼桌宠"
			}
		};
		function activityClass(activity) {
			return activity;
		}
		function clamp(value, max) {
			return Math.round(Math.max(0, Math.min(max, value)));
		}
		function WhalePet({ controller }) {
			const snapshot = (0, react.useSyncExternalStore)(controller.subscribe, controller.getSnapshot);
			const [drag, setDrag] = (0, react.useState)(null);
			const start = (0, react.useRef)(null);
			if (snapshot.pet === "off") return null;
			const asset = ASSETS[snapshot.pet];
			const position = drag ?? snapshot.petPosition;
			const size = Math.round(168 * snapshot.petScale);
			const pointerDown = (event) => {
				event.currentTarget.setPointerCapture(event.pointerId);
				start.current = {
					x: event.clientX,
					y: event.clientY,
					right: position.right,
					bottom: position.bottom
				};
			};
			const pointerMove = (event) => {
				const origin = start.current;
				if (origin === null) return;
				setDrag({
					right: clamp(origin.right - (event.clientX - origin.x), Math.max(0, window.innerWidth - size)),
					bottom: clamp(origin.bottom - (event.clientY - origin.y), Math.max(0, window.innerHeight - size))
				});
			};
			const pointerUp = (event) => {
				if (start.current === null) return;
				event.currentTarget.releasePointerCapture(event.pointerId);
				const finalPosition = drag ?? position;
				start.current = null;
				setDrag(null);
				controller.patch({ petPosition: finalPosition }).catch(() => {});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: pet_module_css_default.overlay,
				"aria-live": "off",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: `${pet_module_css_default.pet} ${pet_module_css_default[activityClass(snapshot.activity)]}`,
					"data-whale-pet": snapshot.pet,
					style: {
						right: position.right,
						bottom: position.bottom,
						width: size,
						height: size
					},
					onPointerDown: pointerDown,
					onPointerMove: pointerMove,
					onPointerUp: pointerUp,
					onPointerCancel: pointerUp,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
						src: asset.src,
						alt: asset.alt,
						draggable: false
					})
				})
			});
		}
		//#endregion
		//#region src/client/index.ts
		const inject = ["slots"];
		function apply(ctx) {
			const controller = new AppearanceController();
			let disposeTheme;
			const syncTheme = () => {
				const enabled = controller.getSnapshot().themeEnabled;
				if (enabled && disposeTheme === void 0) disposeTheme = applyWhaleCanvas(document);
				if (!enabled && disposeTheme !== void 0) {
					disposeTheme();
					disposeTheme = void 0;
				}
			};
			const unsubscribe = controller.subscribe(syncTheme);
			ctx.effect(() => {
				const refresh = () => {
					controller.refresh().catch(() => {});
				};
				let timer;
				const stop = () => {
					if (timer !== void 0) window.clearInterval(timer);
					timer = void 0;
				};
				const start = () => {
					if (document.visibilityState !== "visible" || timer !== void 0) return;
					refresh();
					timer = window.setInterval(refresh, 1e3);
				};
				const visibility = () => {
					if (document.visibilityState === "visible") start();
					else stop();
				};
				document.addEventListener("visibilitychange", visibility);
				start();
				return () => {
					stop();
					document.removeEventListener("visibilitychange", visibility);
					unsubscribe();
					disposeTheme?.();
					disposeTheme = void 0;
				};
			}, "whale-appearance: sync");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "appearance",
				order: 18,
				label: () => "外观",
				inject: () => ({ controller })
			}, AppearanceSettingsCard));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "whale-pet",
				order: 80,
				inject: () => ({ controller })
			}, WhalePet));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map
