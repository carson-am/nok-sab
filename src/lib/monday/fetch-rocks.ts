'use server';

import { unstable_cache } from 'next/cache';
import { strategicRocks } from '../../data/sab-content';

const MONDAY_API = 'https://api.monday.com/v2';

const PERSON_TO_LEADER_ID: Record<string, number> = {
  maddy: 1,
  'maddy mcintyre': 1,
  nick: 2,
  'nick salgado': 2,
  matt: 3,
  'matt casanova': 3,
  corbett: 4,
  'corbett morgan': 4,
  griffin: 5,
  'griffin parrill': 5,
};

function normalizeSlug(s: string): string {
  return s.toLowerCase().replace(/-/g, '_').trim();
}

function resolveLeaderId(personText: string | null | undefined): number | null {
  if (!personText || typeof personText !== 'string') return null;
  const normalized = personText.toLowerCase().trim();
  if (PERSON_TO_LEADER_ID[normalized]) return PERSON_TO_LEADER_ID[normalized];
  const firstName = normalized.split(/\s+/)[0];
  if (PERSON_TO_LEADER_ID[firstName]) return PERSON_TO_LEADER_ID[firstName];
  return null;
}

function parseProgress(milestoneText: string | null | undefined, statusText: string | null | undefined): number {
  if (statusText && String(statusText).trim().toLowerCase() === 'done') return 100;
  if (!milestoneText || typeof milestoneText !== 'string') return 0;
  const t = milestoneText.trim().toLowerCase();
  if (t === 'working' || t === 'in progress') return 25;
  const numMatch = t.match(/(\d+)/);
  if (numMatch) {
    const n = parseInt(numMatch[1], 10);
    return Math.min(100, Math.max(0, n));
  }
  return 0;
}

function getColumnValue(cols: { title?: string; text?: string; value?: string }[], title: string): { text?: string; value?: string } | null {
  const col = cols.find((c) => c.title?.toLowerCase().trim() === title.toLowerCase().trim());
  return col ? { text: col.text, value: col.value } : null;
}

function isShowOnSAB(cols: { title?: string; text?: string; value?: string }[]): boolean {
  const cv = getColumnValue(cols, 'Show on SAB');
  if (!cv) return false;
  const v = (cv.text ?? cv.value ?? '').toString().trim().toLowerCase();
  return v === 'yes' || v === 'true' || v === '1';
}

async function mondayFetch(query: string, variables?: Record<string, unknown>) {
  const token = process.env.MONDAY_API_TOKEN;
  const boardId = process.env.MONDAY_BOARD_ID;
  if (!token || !boardId) {
    return null;
  }
  const res = await fetch(MONDAY_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ query, variables: variables ?? {} }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (json.errors?.length) return null;
  return json.data;
}

type MondayItem = { id: string; name: string; column_values: { id: string; title?: string; text?: string; value?: string }[] };
type MondayPageResult = { cursor?: string; items?: MondayItem[] } | null;
type MondayItemsResponse = { next_items_page?: MondayPageResult; boards?: { items_page?: MondayPageResult }[] } | null;

async function fetchMergedRocksInternal(): Promise<typeof strategicRocks> {
  const boardId = process.env.MONDAY_BOARD_ID;
  if (!boardId) return JSON.parse(JSON.stringify(strategicRocks));

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
                column_values { id title text value type }
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
                  column_values { id title text value type }
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

  const showItems = allItems.filter((item) => isShowOnSAB(item.column_values ?? []));
  const merged = JSON.parse(JSON.stringify(strategicRocks)) as typeof strategicRocks;

  for (const item of showItems) {
    const cols = item.column_values ?? [];
    const slugCv = getColumnValue(cols, 'Dashboard Slug');
    const slugRaw = slugCv?.text ?? slugCv?.value ?? '';
    const mondaySlug = normalizeSlug(String(slugRaw));
    if (!mondaySlug) continue;

    const personCv = getColumnValue(cols, 'Person');
    const personText = personCv?.text ?? personCv?.value ?? '';
    const leaderId = resolveLeaderId(String(personText));
    if (leaderId == null) continue;

    const section = merged.find((s) => s.leaderId === leaderId);
    if (!section?.rocks) continue;

    const rock = section.rocks.find((r: { slug?: string }) => r.slug && normalizeSlug(r.slug) === mondaySlug);
    if (!rock) continue;

    const milestoneCv = getColumnValue(cols, 'Milestone Status');
    const statusCv = getColumnValue(cols, 'Status');
    const milestoneText = milestoneCv?.text ?? milestoneCv?.value ?? '';
    const statusText = statusCv?.text ?? statusCv?.value ?? '';

    rock.progress = parseProgress(String(milestoneText), String(statusText));
    rock.status = statusText && String(statusText).trim() ? String(statusText).trim() : (rock.status ?? 'On Track');
  }

  return merged;
}

export async function getRocksWithMondayData(): Promise<typeof strategicRocks> {
  return unstable_cache(
    fetchMergedRocksInternal,
    ['monday-rocks'],
    { revalidate: 1800 }
  )();
}
