/** artifical delay */
export async function sleep(ms = 2000) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

/** for debug purposes, for testing rollback of optimistic updates for example*/
export async function maybeSleepAndThrow(ms = 2000, probability = 0.5) {
  if (Math.random() < probability) {
    await sleep(ms);
    throw new Error("debug throw");
  }
}
