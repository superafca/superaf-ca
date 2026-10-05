export function claimSend(lock: { current: boolean }) {
  if (lock.current) return false;
  lock.current = true;
  return true;
}

export function releaseSend(lock: { current: boolean }) {
  lock.current = false;
}

/** Lead email first. Conversion and the customer confirmation run only after it sends. */
export async function deliverLead(input: {
  postBrowser: () => Promise<unknown>;
  postServer: () => Promise<unknown>;
  confirm: () => Promise<unknown>;
  track: (event: { transactionId: string; value: number }) => void;
  transactionId: string;
}): Promise<"success" | "failed"> {
  try {
    try {
      await input.postBrowser();
    } catch {
      await input.postServer();
    }
  } catch {
    return "failed";
  }
  try {
    input.track({ transactionId: input.transactionId, value: 1.0 });
  } catch {
    /* the shop already has the lead */
  }
  try {
    void Promise.resolve(input.confirm()).catch(() => {});
  } catch {
    /* confirmation is best-effort */
  }
  return "success";
}
