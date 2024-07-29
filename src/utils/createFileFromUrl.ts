export async function createFileFromUrl(url: string) {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  const filename = pathname.substring(pathname.lastIndexOf("/") + 1);

  // Fetch the image
  const response = await fetch(url);
  const blob = await response.blob();

  // Create a File object
  const file = new File([blob], filename, { type: blob.type });

  return file;
}

export async function createFilesFromUrls(urls: string[]) {
  const promises = urls.map((url: string) => createFileFromUrl(url));
  const files = await Promise.all(promises);

  return files;
}

export function extractFileNameFromCloudinaryUrl(url: string) {
  const urlObject = new URL(url);

  const pathname = urlObject.pathname;

  const filename = pathname.substring(pathname.lastIndexOf("/") + 1);

  return filename;
}
