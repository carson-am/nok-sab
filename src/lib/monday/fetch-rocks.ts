'use server';

import { strategicRocks } from '../../data/sab-content';

const MONDAY_API = 'https://api.monday.com/v2';

/** Hard-coded column IDs from Monday board (avoids Mirror column title lookup issues) */
const COL_IDS = {
  SLUG: 'text_mm19f84h',
  SHOW_ON_SAB: 'color_mm19z4ab',
  MILESTONE: 'lookup_mkttfvw5',
  STATUS: 'status',
  PERSON: 'person',
} as const;

function normalizeSlugForCompare(s: string): string {
  return String(s ?? '').trim().toLowerCase().replace(/-/g, '_');
}

function slugsMatch(mondaySlug: string, codeSlug: string): boolean {
  return normalizeSlugForCompare(mondaySlug) === normalizeSlugForCompare(codeSlug);
}

function parseProgressValue(
  rawValue: string | null | undefined,
  rawText: string | null | undefined,
  displayValue: string | null | undefined
): number | null {
  // Check display_value first (Mirror/Lookup columns often use this)
  const disp = typeof displayValue === 'string' ? displayValue.trim() : '';
  if (disp) {
    const pctMatch = disp.match(/(\d+(?:\.\d+)?)\s*%?/);
    if (pctMatch) {
      const n = parseFloat(pctMatch[1]);
      if (n > 0 && n < 1) return Math.min(100, Math.max(0, Math.round(n * 100)));
      return Math.min(100, Math.max(0, Math.round(n)));
    }
  }
  const textStr = typeof rawText === 'string' ? rawText.trim() : '';
  if (!rawValue && textStr) {
    const pctMatch = textStr.match(/(\d+(?:\.\d+)?)\s*%?/);
    if (pctMatch) {
      const n = parseFloat(pctMatch[1]);
      if (n > 0 && n < 1) return Math.min(100, Math.max(0, Math.round(n * 100)));
      return Math.min(100, Math.max(0, Math.round(n)));
    }
  }
  const val = rawValue ?? rawText ?? '';
  const str = typeof val === 'string' ? val : String(val);
  const trimmed = str.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed == null) return null;
    if (typeof parsed === 'number') {
      const n = parsed;
      if (n > 0 && n <= 1) return Math.min(100, Math.max(0, Math.round(n * 100)));
      return Math.min(100, Math.max(0, Math.round(n)));
    }
    if (typeof parsed.display_value === 'string') {
      const m = parsed.display_value.match(/(\d+(?:\.\d+)?)/);
      if (m) return Math.min(100, Math.max(0, Math.round(parseFloat(m[1]))));
    }
    const numKeys = ['checked', 'progress', 'number', 'value', 'index', 'current_value'];
    for (const key of numKeys) {
      const v = parsed[key];
      if (typeof v === 'number' && !Number.isNaN(v)) {
        if (v > 0 && v <= 1) return Math.min(100, Math.max(0, Math.round(v * 100)));
        return Math.min(100, Math.max(0, Math.round(v)));
      }
      if (key === 'checked' && typeof v === 'boolean') return v ? 100 : 0;
    }
    return null;
  } catch {
    // fallthrough
  }

  const pctMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*%?$/);
  if (pctMatch) {
    const n = parseFloat(pctMatch[1]);
    if (n > 0 && n < 1) return Math.min(100, Math.max(0, Math.round(n * 100)));
    return Math.min(100, Math.max(0, Math.round(n)));
  }

  const decimalMatch = trimmed.match(/^0?\.\d+$/);
  if (decimalMatch) {
    const n = parseFloat(trimmed);
    return Math.min(100, Math.max(0, Math.round(n * 100)));
  }

  return null;
}

function parseProgress(
  milestoneText: string | null | undefined,
  milestoneValue: string | null | undefined,
  milestoneDisplayValue: string | null | undefined,
  statusText: string | null | undefined
): number | null {
  // 1. Status override: "Done" -> 100
  if (statusText && String(statusText).trim().toLowerCase() === 'done') return 100;
  // 2. Check display_value for percentage first (e.g. "85%")
  const parsed = parseProgressValue(milestoneValue, milestoneText, milestoneDisplayValue);
  if (parsed != null && parsed > 0) return parsed;
  // 3. "Working" label -> 25
  const disp = String(milestoneDisplayValue ?? milestoneText ?? '').trim().toLowerCase();
  if (disp === 'working' || disp === 'in progress') return 25;
  if (parsed != null) return parsed;
  const t = String(milestoneText ?? milestoneDisplayValue ?? '').trim().toLowerCase();
  if (t === 'working' || t === 'in progress') return 25;
  const numMatch = t.match(/(\d+)/);
  if (numMatch) {
    const n = parseInt(numMatch[1], 10);
    return Math.min(100, Math.max(0, n));
  }
  return null;
}

function getColumnById(
  cols: { id: string; text?: string; value?: string; display_value?: string }[],
  columnId: string
): { text?: string; value?: string; display_value?: string } | null {
  const col = cols.find((c) => c.id === columnId);
  return col ? { text: col.text, value: col.value, display_value: col.display_value } : null;
}

/** Remove emojis and special symbols from status text for clean display. */
function stripEmojis(str: string): string {
  return str
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{203C}\u{2049}\u{26A0}\u{26A1}\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract clean status label from Monday Status column. Never returns raw JSON. */
function extractStatusLabel(statusCv: { text?: string; value?: string } | null): string {
  if (!statusCv) return 'On Track';
  const text = typeof statusCv.text === 'string' ? statusCv.text.trim() : '';
  if (text && !text.startsWith('{') && !text.startsWith('[')) return stripEmojis(text);
  const val = typeof statusCv.value === 'string' ? statusCv.value.trim() : '';
  if (!val || (!val.startsWith('{') && !val.startsWith('['))) return stripEmojis(val || 'On Track');
  try {
    const parsed = JSON.parse(val) as Record<string, unknown>;
    if (typeof parsed?.text === 'string' && !parsed.text.startsWith('{')) return stripEmojis(parsed.text.trim());
    if (typeof parsed?.label === 'string' && !parsed.label.startsWith('{')) return stripEmojis(parsed.label.trim());
    if (typeof parsed?.index === 'number' && parsed.index === 5) return 'Board Input Impactful';
  } catch {
    return 'On Track';
  }
  return 'On Track';
}

function isShowOnSAB(columnValues: { id: string; text?: string; value?: string }[]): boolean {
  const cv = getColumnById(columnValues, COL_IDS.SHOW_ON_SAB);
  if (!cv) return false;
  const v = (cv.text ?? cv.value ?? '').toString().trim().toLowerCase();
  return v === 'yes' || v === 'true' || v === '1';
}

async function mondayFetch(query: string, variables?: Record<string, unknown>) {
  const token = process.env.MONDAY_API_TOKEN;
  const boardId = process.env.MONDAY_BOARD_ID;
  if (!token || !boardId) return null;
  try {
    const res = await fetch(MONDAY_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ query, variables: variables ?? {} }),
      cache: 'no-store',
    });
    const json = await res.json();
    if (!res.ok) return null;
    if (json.errors?.length) return null;
    return json.data;
  } catch {
    return null;
  }
}

type MondayColumnValue = { id: string; text?: string; value?: string; display_value?: string };
type MondayItem = { id: string; name: string; column_values: MondayColumnValue[] };
type MondayPageResult = { cursor?: string; items?: MondayItem[] } | null;
type MondayItemsResponse = { next_items_page?: MondayPageResult; boards?: { items_page?: MondayPageResult }[] } | null;

async function fetchMergedRocksInternal(): Promise<typeof strategicRocks> {
  const merged = JSON.parse(JSON.stringify(strategicRocks)) as typeof strategicRocks;
  try {
    const boardId = process.env.MONDAY_BOARD_ID;
    if (!boardId) return merged;

    const allItems: MondayItem[] = [];
    let cursor: string | null = null;

    do {
      const itemsRes: MondayItemsResponse = cursor
        ? await mondayFetch(`
            query($c: String!) {
              next_items_page(cursor: $c) {
                cursor
                items {
                  id
                  name
                  column_values(ids: ["lookup_mkttfvw5", "status", "text_mm19f84h", "color_mm19z4ab"]) {
                    id
                    text
                    value
                    ... on MirrorValue { display_value }
                  }
                }
              }
            }
          `, { c: cursor })
        : await mondayFetch(`
            query($bid: [ID!]!) {
              boards(ids: $bid) {
                items_page(limit: 500) {
                  cursor
                  items {
                    id
                    name
                    column_values(ids: ["lookup_mkttfvw5", "status", "text_mm19f84h", "color_mm19z4ab"]) {
                      id
                      text
                      value
                      ... on MirrorValue { display_value }
                    }
                  }
                }
              }
            }
          `, { bid: [boardId] });

      let pageItems: MondayItem[] = [];
      let nextCursor: string | null = null;

      if (cursor) {
        const np: MondayPageResult = itemsRes?.next_items_page ?? null;
        if (np) {
          pageItems = np.items ?? [];
          nextCursor = np.cursor ?? null;
        }
      } else {
        const bp: MondayPageResult = itemsRes?.boards?.[0]?.items_page ?? null;
        if (bp) {
          pageItems = bp.items ?? [];
          nextCursor = bp.cursor ?? null;
        }
      }

      allItems.push(...pageItems);
      cursor = nextCursor;
    } while (cursor);

    const showItems = allItems.filter((item) =>
      isShowOnSAB(item.column_values ?? [])
    );

    const mergedRocks = JSON.parse(JSON.stringify(strategicRocks)) as typeof strategicRocks;

    for (const item of showItems) {
      const cols = item.column_values ?? [];
      const slugCv = getColumnById(cols, COL_IDS.SLUG);
      const slugRaw = slugCv?.text ?? slugCv?.value ?? '';
      const slugValue = String(slugRaw || '').trim();
      if (!slugValue) continue;

      // Owner-agnostic: find rock by slug across all sections (sab-content defines placement)
      let rock: { progress?: number; status?: string; slug?: string } | undefined;
      let section: (typeof mergedRocks)[0] | undefined;
      for (const s of mergedRocks) {
        if (!s.rocks) continue;
        const r = s.rocks.find((r: { slug?: string }) => r.slug && slugsMatch(slugValue, r.slug));
        if (r) {
          rock = r;
          section = s;
          break;
        }
      }
      if (!rock || !section) continue;

      const milestoneCv = getColumnById(cols, COL_IDS.MILESTONE);
      const statusCv = getColumnById(cols, COL_IDS.STATUS);
      const milestoneText = milestoneCv?.text ?? '';
      const milestoneValue = milestoneCv?.value ?? '';
      const milestoneDisplayValue = milestoneCv?.display_value ?? milestoneCv?.text ?? '';
      const statusLabel = extractStatusLabel(statusCv);
      const mondayProgress = parseProgress(
        milestoneText,
        milestoneValue,
        milestoneDisplayValue,
        statusLabel
      );

      // Progress safety: keep sab-content value when Monday returns 0/null
      rock.progress = (mondayProgress != null && mondayProgress > 0)
        ? mondayProgress
        : (rock.progress ?? 0);
      rock.status = statusLabel;
    }

    return mergedRocks;
  } catch {
    return merged;
  }
}

export async function getRocksWithMondayData(): Promise<typeof strategicRocks> {
  // Bypass cache for testing - call directly
  return fetchMergedRocksInternal();
}
