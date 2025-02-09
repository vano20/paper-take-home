export function convertToHttps(url: string): string {
  if (!url) return url;

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  let parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'https:') {
    parsedUrl.protocol = 'https:';
  }
  return parsedUrl.toString();
}