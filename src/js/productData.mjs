function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}
export async function getData(category = "tents") {
  // attempt a few likely locations for the JSON so this works in dev and
  // after build/preview. Try in order: /json, /src/json, relative ../json
  const candidates = [
    `/json/${category}.json`,
    `/src/json/${category}.json`,
    `../json/${category}.json`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      // skip non-OK responses
      if (!res.ok) continue;
      // ensure we have JSON (avoid parsing HTML pages)
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json") && !contentType.includes("text/json")) {
        // not JSON, skip
        continue;
      }
      return await res.json();
    } catch (err) {
      // try next candidate
      // (ignore network errors for individual attempts)
    }
  }

  // last resort: try the original relative path and let any error bubble up
  return fetch(`../json/${category}.json`).then(convertToJson).then((data) => data);
}

export async function findProductById(id) {
  const products = await getData();
  return products.find((item) => item.Id === id);
}
