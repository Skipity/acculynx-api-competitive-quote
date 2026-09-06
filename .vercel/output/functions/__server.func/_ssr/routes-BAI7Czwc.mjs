import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as KeyRound, c as ChevronRight, i as LoaderCircle, l as Check, n as Trash2, o as FileUp, r as ShieldAlert } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as AppShell } from "./app-shell-Cl2qqXg6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as fetchJobs, i as extractQuoteFn, n as Route$4, o as pingKeys, r as commitWriteFn, s as prepareWriteFn } from "./router-DZ49iCrW.mjs";
import { t as FIELD_CONTRACT } from "./field-contract-DhjiAgpP.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BAI7Czwc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "default", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
			default: "bg-accent-soft text-accent",
			ok: "bg-accent-soft text-ok",
			warn: "bg-bg-warm text-warn",
			danger: "bg-bg-warm text-danger",
			muted: "bg-bg-warm text-muted"
		}[tone], className),
		children
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg [&_svg]:size-4", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-surface-2 text-ink border border-border hover:bg-bg-warm",
			ghost: "text-ink hover:bg-bg-warm",
			danger: "bg-danger text-accent-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4 rounded-sm text-sm",
			sm: "h-9 px-3 rounded-sm text-sm",
			lg: "h-12 px-5 rounded-md text-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-sm border border-border bg-surface-2 px-3 text-sm text-ink placeholder:text-subtle", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:opacity-50", className),
		...props
	});
}
var ACC = "qi.acculynxKey";
var GEM = "qi.geminiKey";
var MODEL = "qi.geminiModel";
function readKeys() {
	if (typeof window === "undefined") return {
		acculynxKey: "",
		geminiKey: "",
		model: "gemini-3.7-flash"
	};
	return {
		acculynxKey: sessionStorage.getItem(ACC) ?? "",
		geminiKey: sessionStorage.getItem(GEM) ?? "",
		model: sessionStorage.getItem(MODEL) ?? "gemini-3.7-flash"
	};
}
function writeKeys(next) {
	sessionStorage.setItem(ACC, next.acculynxKey);
	sessionStorage.setItem(GEM, next.geminiKey);
	sessionStorage.setItem(MODEL, next.model || "gemini-3.7-flash");
}
function clearKeys() {
	sessionStorage.removeItem(ACC);
	sessionStorage.removeItem(GEM);
	sessionStorage.removeItem(MODEL);
}
function IngestPage() {
	const initial = Route$4.useLoaderData();
	const [keys, setKeys] = (0, import_react.useState)({
		acculynxKey: "",
		geminiKey: "",
		model: "gemini-3.7-flash"
	});
	const [keysOpen, setKeysOpen] = (0, import_react.useState)(false);
	const [pinging, setPinging] = (0, import_react.useState)(false);
	const [jobs, setJobs] = (0, import_react.useState)(initial.jobs);
	const [jobSource, setJobSource] = (0, import_react.useState)(initial.source);
	const [jobId, setJobId] = (0, import_react.useState)(initial.jobs[0]?.id || "");
	const [file, setFile] = (0, import_react.useState)(null);
	const [extracting, setExtracting] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [setupNeeded, setSetupNeeded] = (0, import_react.useState)([]);
	const [dryRun, setDryRun] = (0, import_react.useState)(true);
	const [writing, setWriting] = (0, import_react.useState)(false);
	const [writeLog, setWriteLog] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setKeys(readKeys());
	}, []);
	async function loadJobs(acculynxKey) {
		try {
			const data = await fetchJobs({ data: { acculynxKey: acculynxKey || void 0 } });
			setJobs(data.jobs);
			setJobSource(data.source);
			setJobId((id) => id || data.jobs[0]?.id || "");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not list jobs");
			const data = await fetchJobs({ data: {} });
			setJobs(data.jobs);
			setJobSource("mock");
			setJobId(data.jobs[0]?.id || "");
		}
	}
	function persistKeys(next) {
		setKeys(next);
		writeKeys(next);
	}
	const mode = (0, import_react.useMemo)(() => {
		if (keys.acculynxKey && keys.geminiKey) return "live";
		if (keys.geminiKey) return "extract-only";
		if (keys.acculynxKey) return "acculynx-only";
		return "mock";
	}, [keys]);
	async function onPing() {
		setPinging(true);
		try {
			const out = await pingKeys({ data: {
				acculynxKey: keys.acculynxKey || void 0,
				geminiKey: keys.geminiKey || void 0
			} });
			if (out.acculynx) out.acculynx.ok ? toast.success("AccuLynx key accepted") : toast.error(out.acculynx.error);
			if (out.gemini) out.gemini.ok ? toast.success("Gemini key accepted") : toast.error(out.gemini.error);
			if (!out.acculynx && !out.gemini) toast.message("Add a key first — or stay in mock mode.");
			if (keys.acculynxKey && out.acculynx?.ok) await loadJobs(keys.acculynxKey);
		} finally {
			setPinging(false);
		}
	}
	async function runExtract(useSample) {
		setExtracting(true);
		setWriteLog(null);
		try {
			let base64;
			if (file && !useSample) base64 = await fileToBase64(file);
			const extracted = await extractQuoteFn({ data: {
				geminiKey: keys.geminiKey || void 0,
				model: keys.model,
				filename: file?.name,
				mimeType: file?.type || "application/pdf",
				base64,
				useSample: useSample || !file
			} });
			setResult(extracted);
			const prep = await prepareWriteFn({ data: {
				acculynxKey: keys.acculynxKey || void 0,
				values: extracted.values
			} });
			setRows(prep.rows);
			setSetupNeeded(prep.setupNeeded);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Extract failed");
		} finally {
			setExtracting(false);
		}
	}
	async function onWrite() {
		if (!jobId) {
			toast.error("Select a job first");
			return;
		}
		setWriting(true);
		try {
			const out = await commitWriteFn({ data: {
				acculynxKey: keys.acculynxKey || void 0,
				jobId,
				dryRun: dryRun || !keys.acculynxKey,
				rows
			} });
			setWriteLog(JSON.stringify(out, null, 2));
			if (out.dryRun) toast.success("Dry-run payload ready — nothing written");
			else toast.success("Custom fields written to AccuLynx");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Write failed");
		} finally {
			setWriting(false);
		}
	}
	const selected = jobs.find((j) => j.id === jobId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-wider text-subtle",
						children: "AccuLynx API sample"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl",
						children: "Competitor quote ingest"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: "PDF in. Structured job custom fields out. The model extracts; this app decides the motion and will not write until you confirm."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: mode === "mock" ? "muted" : mode === "live" ? "ok" : "warn",
						children: mode === "mock" ? "Mock mode — no keys" : mode === "live" ? "Live keys in this session" : mode === "extract-only" ? "Gemini only — AccuLynx writes mocked" : "AccuLynx only — extract uses fixture"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "muted",
						children: ["Jobs: ", jobSource]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						onClick: () => setKeysOpen((v) => !v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, {}), "API keys"]
					})
				]
			}),
			keysOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-8 rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mt-0.5 size-4 shrink-0 text-warn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Keys stay in ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-ink",
									children: "this browser session"
								}),
								" and are sent only to this app’s server functions. They are never written to disk or the repo. Treat the AccuLynx key like a password for that location. Do not deploy this key form to the public internet."
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block font-medium",
									children: "AccuLynx API key"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									autoComplete: "off",
									placeholder: "Bearer token from my.acculynx.com/apikeys",
									value: keys.acculynxKey,
									onChange: (e) => persistKeys({
										...keys,
										acculynxKey: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block font-medium",
									children: "Gemini API key"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									autoComplete: "off",
									placeholder: "Google AI Studio key",
									value: keys.geminiKey,
									onChange: (e) => persistKeys({
										...keys,
										geminiKey: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block font-medium",
									children: "Gemini model"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: keys.model,
									onChange: (e) => persistKeys({
										...keys,
										model: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => void onPing(),
							disabled: pinging,
							children: [pinging ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}), "Test keys"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => {
								clearKeys();
								persistKeys({
									acculynxKey: "",
									geminiKey: "",
									model: "gemini-3.7-flash"
								});
								loadJobs("");
								toast.message("Keys cleared from this session");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Forget keys"]
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "grid gap-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 1,
							title: "Choose the AccuLynx job"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Competitive intel belongs on a job, not in a floating note."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm font-medium",
							children: ["Job", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1.5 h-11 w-full rounded-sm border border-border bg-surface-2 px-3 text-sm",
								value: jobId,
								onChange: (e) => setJobId(e.target.value),
								children: jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: j.id,
									children: [
										j.jobNumber,
										" — ",
										j.customer,
										" (",
										j.milestone,
										")"
									]
								}, j.id))
							})]
						}),
						selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 font-mono text-xs text-muted",
							children: [
								selected.street,
								selected.city ? `, ${selected.city}` : "",
								" ",
								selected.state,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								selected.id
							]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 2,
							title: "Upload the competitor quote"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "PDF preferred. Without a Gemini key, load the fixture quote."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border-strong bg-surface-2 px-4 py-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "mb-2 size-5 text-accent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: file ? file.name : "Drop a PDF or click to browse"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "application/pdf,image/png,image/jpeg",
									className: "sr-only",
									onChange: (e) => setFile(e.target.files?.[0] ?? null)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => void runExtract(false),
								disabled: extracting,
								children: [extracting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {}), "Extract"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => void runExtract(true),
								disabled: extracting,
								children: "Load sample quote"
							})]
						})
					]
				})]
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 grid gap-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 3,
							title: "Review the extract"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: result.extracted.quoteQuality === "complete" ? "ok" : "warn",
									children: result.extracted.quoteQuality
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: result.extracted.recommendedMotion }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									tone: "muted",
									children: [(result.extracted.confidence * 100).toFixed(0), "% confidence"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "muted",
									children: result.source === "mock" ? "fixture" : result.model
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-2 gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									k: "Competitor",
									v: result.extracted.competitorName ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									k: "Total",
									v: result.extracted.totalPrice != null ? `$${result.extracted.totalPrice.toLocaleString()}` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									k: "Squares",
									v: result.extracted.squares != null ? String(result.extracted.squares) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									k: "Material",
									v: result.extracted.materialFamily
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed",
							children: result.extracted.salesBrief
						}),
						result.extracted.missing.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-warn",
							children: ["Missing: ", result.extracted.missing.join(", ")]
						}) : null,
						result.extracted.evidence.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-1 font-mono text-xs text-muted",
							children: result.extracted.evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"“",
								e,
								"”"
							] }, e))
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface p-4 shadow-panel sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							n: 4,
							title: "Map → AccuLynx custom fields"
						}),
						setupNeeded.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-warn",
							children: [
								"Create these job custom fields in AccuLynx, then extract again:",
								" ",
								setupNeeded.join(", "),
								"."
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Labels matched to definitions. Values are what PUT will send."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[280px] text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-xs uppercase tracking-wide text-subtle",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-2 font-medium",
										children: "Field"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Value"
									})] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 pr-2 align-top",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: r.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-mono text-[11px] text-subtle",
											children: [r.fieldType, r.missing ? " · missing def" : ""]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: r.value ?? "",
											onChange: (e) => {
												const v = e.target.value;
												setRows((prev) => prev.map((row) => row.key === r.key ? {
													...row,
													value: v || null
												} : row));
											}
										})
									})]
								}, r.key)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 flex min-h-11 items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "size-4 accent-accent",
								checked: dryRun,
								onChange: (e) => setDryRun(e.target.checked)
							}), "Dry-run (no AccuLynx write)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Live PUT requires an AccuLynx key and dry-run off. Default is dry-run."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "mt-3",
							onClick: () => void onWrite(),
							disabled: writing,
							children: [writing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}), dryRun || !keys.acculynxKey ? "Generate PUT payload" : "Write to AccuLynx"]
						}),
						writeLog ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-3 max-h-56 overflow-auto rounded-sm bg-ink p-3 font-mono text-[11px] leading-relaxed text-accent-fg",
							children: writeLog
						}) : null
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-10 max-w-2xl text-xs text-subtle",
				children: [
					"Field contract: ",
					FIELD_CONTRACT.map((f) => f.labels[0]).join(" · "),
					". Writes never touch milestones, money, or contacts. See the product brief for why notes are not the destination."
				]
			})
		]
	}) });
}
function Step({ n, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
		className: "flex items-center gap-2 font-display text-lg font-medium tracking-tight",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-6 items-center justify-center rounded-full bg-accent text-xs text-accent-fg",
			children: n
		}), title]
	});
}
function Fact({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-subtle",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-medium tabular-nums",
		children: v
	})] });
}
function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read file"));
		reader.onload = () => {
			const s = String(reader.result ?? "");
			const comma = s.indexOf(",");
			resolve(comma >= 0 ? s.slice(comma + 1) : s);
		};
		reader.readAsDataURL(file);
	});
}
//#endregion
export { IngestPage as component };
