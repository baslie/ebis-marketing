import { LS_KEY_UTM } from '../data/constants';

interface UtmData {
  path: string;
  search: string;
}

/** Read saved UTM data, preferring current URL query string. */
export function readUtm(): { search: string; landingPath: string; params: URLSearchParams } {
  const currentQs = window.location.search;
  const saved: UtmData | null = JSON.parse(
    localStorage.getItem(LS_KEY_UTM) || 'null',
  );
  const search = currentQs.length > 1 ? currentQs : (saved?.search || '');
  const landingPath = saved?.path || window.location.pathname;
  return { search, landingPath, params: new URLSearchParams(search) };
}

/** Remove saved UTM data after successful form submission. */
export function clearUtm(): void {
  localStorage.removeItem(LS_KEY_UTM);
}
