import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type ClaimStatus = "pending" | "paid" | "rejected";

export type Claim = {
  id: string;
  name: string;
  email: string;
  phone: string;
  utr: string;
  amount: number;
  status: ClaimStatus;
  unlockCode: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
};

export type Activity = {
  id: string;
  at: string;
  kind: string;
  detail: string;
};

export type StoreData = {
  claims: Claim[];
  activity: Activity[];
};

const empty = (): StoreData => ({ claims: [], activity: [] });

function filePath() {
  return path.join(process.cwd(), "data", "challan.json");
}

async function readFileStore(): Promise<StoreData> {
  try {
    const raw = await readFile(filePath(), "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    return {
      claims: parsed.claims ?? [],
      activity: parsed.activity ?? [],
    };
  } catch {
    return empty();
  }
}

async function writeFileStore(data: StoreData) {
  await mkdir(path.dirname(filePath()), { recursive: true });
  await writeFile(filePath(), JSON.stringify(data, null, 2));
}

async function githubGet(): Promise<{ data: StoreData; sha: string | null }> {
  const repo = process.env.STORE_GITHUB_REPO;
  const token = process.env.STORE_GITHUB_TOKEN;
  if (!repo || !token) throw new Error("github store not configured");
  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/data/challan.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    },
  );
  if (res.status === 404) return { data: empty(), sha: null };
  if (!res.ok) throw new Error(`github read ${res.status}`);
  const body = (await res.json()) as { content: string; sha: string };
  const parsed = JSON.parse(Buffer.from(body.content, "base64").toString()) as StoreData;
  return {
    data: { claims: parsed.claims ?? [], activity: parsed.activity ?? [] },
    sha: body.sha,
  };
}

async function githubPut(data: StoreData, sha: string | null) {
  const repo = process.env.STORE_GITHUB_REPO;
  const token = process.env.STORE_GITHUB_TOKEN;
  if (!repo || !token) throw new Error("github store not configured");
  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/data/challan.json`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "chore: update Challan claims",
        content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
        sha: sha ?? undefined,
      }),
    },
  );
  if (!res.ok) throw new Error(`github write ${res.status}`);
}

export function storeMode() {
  if (process.env.STORE_GITHUB_TOKEN && process.env.STORE_GITHUB_REPO) return "github";
  return "file";
}

export async function loadStore(): Promise<StoreData> {
  if (storeMode() === "github") {
    return (await githubGet()).data;
  }
  return readFileStore();
}

export async function saveStore(data: StoreData) {
  data.activity = data.activity.slice(0, 200);
  if (storeMode() === "github") {
    const current = await githubGet();
    await githubPut(data, current.sha);
    return;
  }
  await writeFileStore(data);
}

export async function mutateStore<T>(fn: (data: StoreData) => T | Promise<T>) {
  const data = await loadStore();
  const result = await fn(data);
  await saveStore(data);
  return result;
}

export function newClaimId() {
  return `chl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function newUnlockCode() {
  const raw = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CHL-${raw}`;
}

export function logActivity(data: StoreData, kind: string, detail: string) {
  data.activity.unshift({
    id: newClaimId(),
    at: new Date().toISOString(),
    kind,
    detail,
  });
}
