const nativeFetch = globalThis.fetch;
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

let requestCount = 0;
globalThis.fetch = async (...args) => {
  requestCount += 1;
  await sleep(requestCount === 1 ? 500 : 1500);

  let response;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    response = await nativeFetch(...args);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt === 5) return response;

    const retryAfter = Number(response.headers.get('retry-after'));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 5000 * (2 ** attempt);
    console.log(`Fetch HTTP ${response.status}; retrying in ${delay} ms`);
    await sleep(delay);
  }
  return response;
};
