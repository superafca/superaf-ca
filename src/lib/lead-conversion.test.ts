import assert from "node:assert/strict";
import test from "node:test";
import { claimSend, deliverLead, releaseSend } from "./deliver-lead.ts";
import { leadTransactionId, trackLeadConversion } from "./track.ts";

function installBrowser() {
  const store = new Map<string, string>();
  const gtagCalls: unknown[][] = [];
  const sessionStorage = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
  (globalThis as { window?: unknown }).window = {
    sessionStorage,
    dataLayer: [] as unknown[],
    gtag: (...args: unknown[]) => {
      gtagCalls.push(args);
    },
  };
  return { gtagCalls, store };
}

const email = "Jesus@Superaf.ca";
const phone = "(587) 900-9494";

test("lead OK fires one conversion with a transaction id, then confirms", async () => {
  const { gtagCalls } = installBrowser();
  const log: string[] = [];
  const transactionId = leadTransactionId(email, phone);
  const outcome = await deliverLead({
    transactionId,
    postBrowser: async () => {
      log.push("lead");
    },
    postServer: async () => {
      log.push("server");
    },
    confirm: async () => {
      log.push("confirm");
    },
    track: (event) => {
      log.push("track");
      trackLeadConversion(event);
    },
  });
  assert.equal(outcome, "success");
  assert.deepEqual(log, ["lead", "track", "confirm"]);
  assert.equal(gtagCalls.length, 1);
  const payload = gtagCalls[0]?.[2] as { transaction_id?: string; value?: number; currency?: string; send_to?: string };
  assert.equal(payload.transaction_id, transactionId);
  assert.equal(payload.value, 1.0);
  assert.equal(payload.currency, "CAD");
  assert.equal(payload.send_to, "AW-18489064646/E3SCCKLm2Y0dEMb5ovBE");
  assert.equal(gtagCalls[0]?.[1], "conversion");
});

test("both sends failing fires no conversion and does not confirm", async () => {
  const { gtagCalls } = installBrowser();
  let confirmed = false;
  const outcome = await deliverLead({
    transactionId: leadTransactionId(email, phone),
    postBrowser: async () => {
      throw new Error("browser down");
    },
    postServer: async () => {
      throw new Error("server down");
    },
    confirm: async () => {
      confirmed = true;
    },
    track: (event) => trackLeadConversion(event),
  });
  assert.equal(outcome, "failed");
  assert.equal(confirmed, false);
  assert.equal(gtagCalls.length, 0);
});

test("the same person submitting twice sends twice and converts once", async () => {
  const { gtagCalls } = installBrowser();
  let leads = 0;
  const ids: string[] = [];
  for (let i = 0; i < 2; i++) {
    const transactionId = leadTransactionId(" JESUS@superaf.ca ", "587.900.9494");
    ids.push(transactionId);
    const outcome = await deliverLead({
      transactionId,
      postBrowser: async () => {
        leads += 1;
      },
      postServer: async () => {
        throw new Error("unused");
      },
      confirm: async () => {},
      track: (event) => trackLeadConversion(event),
    });
    assert.equal(outcome, "success");
  }
  assert.equal(leads, 2);
  assert.equal(gtagCalls.length, 1);
  assert.equal(ids[0], ids[1]);
  const payload = gtagCalls[0]?.[2] as { transaction_id?: string };
  assert.equal(payload.transaction_id, ids[0]);
});

test("a second LEVEL UP while sending does not start another send", async () => {
  const lock = { current: false };
  let sends = 0;
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  async function submit() {
    if (!claimSend(lock)) return;
    try {
      sends += 1;
      await gate;
    } finally {
      releaseSend(lock);
    }
  }
  const first = submit();
  const second = submit();
  assert.equal(sends, 1);
  release();
  await Promise.all([first, second]);
  assert.equal(sends, 1);
});
