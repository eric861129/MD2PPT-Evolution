/**
 * MD2PPT-Evolution
 * Image processing utilities
 */

/**
 * Fetches an image from a URL and converts it to a Base64 string.
 * Returns null if the fetch fails (e.g., CORS issue).
 */
export const imageUrlToBase64 = async (url: string): Promise<string | null> => {
  if (url.startsWith('data:image')) return url;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    return null;
  }
};
