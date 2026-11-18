import type { Product } from "@/lib/types";

type GalleryProduct = Pick<Product, "image" | "images">;

/**
 * The images shown on the product detail page.
 *
 * The product's current image is always first, including an admin override.
 * When it differs from the seed gallery's first image, that old seed image is
 * dropped and the rest of the gallery is kept.
 */
export function productGallery(product: GalleryProduct): string[] {
  const images = (product.images ?? []).filter(Boolean);
  const seedFirstImage = images[0];

  if (product.image && product.image !== seedFirstImage) {
    return [product.image, ...images.slice(1)];
  }

  if (images.length > 0) return images;
  return product.image ? [product.image] : [];
}
