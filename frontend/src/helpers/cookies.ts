export function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Session helpers
export function setSession(userId: string, sessionId: string) {
  setCookie('userId', userId);
  setCookie('sessionId', sessionId);
}

export function getSession() {
  return {
    userId: getCookie('userId'),
    sessionId: getCookie('sessionId'),
  };
}

export function clearSession() {
  deleteCookie('userId');
  deleteCookie('sessionId');
}
