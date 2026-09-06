const ACC = "qi.acculynxKey";
const GEM = "qi.geminiKey";
const MODEL = "qi.geminiModel";

export type SessionKeys = {
  acculynxKey: string;
  geminiKey: string;
  model: string;
};

export function readKeys(): SessionKeys {
  if (typeof window === "undefined") {
    return { acculynxKey: "", geminiKey: "", model: "gemini-3.7-flash" };
  }
  return {
    acculynxKey: sessionStorage.getItem(ACC) ?? "",
    geminiKey: sessionStorage.getItem(GEM) ?? "",
    model: sessionStorage.getItem(MODEL) ?? "gemini-3.7-flash",
  };
}

export function writeKeys(next: SessionKeys) {
  sessionStorage.setItem(ACC, next.acculynxKey);
  sessionStorage.setItem(GEM, next.geminiKey);
  sessionStorage.setItem(MODEL, next.model || "gemini-3.7-flash");
}

export function clearKeys() {
  sessionStorage.removeItem(ACC);
  sessionStorage.removeItem(GEM);
  sessionStorage.removeItem(MODEL);
}
