const DRAFT_KEY = "algohint-user-draft";

export function loadDraft(storage) {
  try {
    return (storage ?? globalThis.localStorage)?.getItem(DRAFT_KEY) ?? "";
  } catch (error) {
    console.warn("Unable to load saved draft:", error);

    return "";
  }
}

export function saveDraft(text, storage) {
  try {
    (storage ?? globalThis.localStorage)?.setItem(DRAFT_KEY, text);
  } catch (error) {
    console.warn("Unable to save draft:", error);
  }
}
