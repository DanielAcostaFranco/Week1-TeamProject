const baseURL = import.meta.env.VITE_SERVER_URL;
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}
// normalize image URLs returned by the API so the frontend can use them
function normalizeImageUrl(url) {
  if (!url) return url;
  const trimmed = String(url).trim();
  // already absolute
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  // protocol-relative (//cdn.example.com/image.jpg)
  if (trimmed.startsWith("//")) return window.location.protocol + trimmed;
  // absolute path on server (/images/..)
  if (trimmed.startsWith("/")) return (baseURL ? baseURL.replace(/\/$/, "") : "") + trimmed;
  // relative path (images/..)
  return (baseURL ? baseURL.replace(/\/$/, "") : "") + "/" + trimmed.replace(/^\//, "");
}

function normalizeProductImages(product) {
  if (!product || typeof product !== "object") return product;

  // common field names used in this project: Image, Images, image, images
  if (product.Image) product.Image = normalizeImageUrl(product.Image);
  if (product.image) product.image = normalizeImageUrl(product.image);
  if (Array.isArray(product.Images)) product.Images = product.Images.map(normalizeImageUrl);
  if (Array.isArray(product.images)) product.images = product.images.map(normalizeImageUrl);

  // some APIs return an Images object with sized keys (PrimarySmall/Medium/Large)
  // map that to a single `Image` field so the rest of the app can use product.Image
  if (product.Images && typeof product.Images === "object" && !Array.isArray(product.Images)) {
    const pick =
      product.Images.PrimaryLarge || product.Images.PrimaryMedium || product.Images.PrimarySmall || product.Images.Primary || null;
    if (pick) {
      product.Image = normalizeImageUrl(pick);
    }
    // also normalize nested extra images if present
    if (Array.isArray(product.Images.ExtraImages)) {
      product.Images.ExtraImages = product.Images.ExtraImages.map(normalizeImageUrl);
    }
  }

  // brand logo
  if (product.Brand && product.Brand.LogoSrc) {
    product.Brand.LogoSrc = normalizeImageUrl(product.Brand.LogoSrc);
  }

  // any nested gallery or thumbnail fields (best-effort)
  if (product.Thumbnail) product.Thumbnail = normalizeImageUrl(product.Thumbnail);
  if (product.thumbnail) product.thumbnail = normalizeImageUrl(product.thumbnail);

  return product;
}

export async function getData(category) {
  const response = await fetch(baseURL + `products/search/${category}`);
  const data = await convertToJson(response);
  const results = data.Result || [];
  return results.map(normalizeProductImages);
}

export async function findProductById(id) {
  const response = await fetch(baseURL + `product/${id}`);
  const productResp = await convertToJson(response);
  const product = productResp.Result;
  return normalizeProductImages(product);
}