function isEncodedURIComponent(html: string) {
  // Check if the string contains typical URI encoded patterns like %20, %21, etc.
  return /%[0-9A-Fa-f]{2}/.test(html);
}

export function formatContent(html: string) {
  try {
    if (isEncodedURIComponent(html)) {
      return decodeURIComponent(html);
    }
    return html;
  } catch (e) {
    return html;
  }
}

export function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

export function ensureHTTPS(url: string | null) {
  if (!url) {
    return '';
  }
  return url;
  /*    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    } else if (/^http:\/\//i.test(url)) {
        url = url.replace(/^http:/i, 'https:');
    }
    return url;*/
}
