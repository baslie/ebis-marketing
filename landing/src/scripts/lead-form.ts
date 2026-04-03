/**
 * Lead form → Telegram bot handler.
 *
 * Static site (Astro SSG) on GitHub Pages — no server runtime.
 * Bot token is scoped to sendMessage only. Risk is limited to spam.
 */

const BOT_TOKEN = '8679984493:AAHf5dxUO6ec49IxTwWDy6c54mhXFfH6gCo';
const CHAT_ID = '-5057763299';
const TELEGRAM_HANDLE = '@marketer_for_business';

// UTM: prefer current URL query string, fall back to localStorage
const currentQs = window.location.search;
const saved: { path?: string; search?: string } | null = JSON.parse(
  localStorage.getItem('mm_utm') || 'null',
);
const utmSearch = currentQs.length > 1 ? currentQs : (saved?.search || '');
const utmLandingPath = saved?.path || window.location.pathname;
const urlParams = new URLSearchParams(utmSearch);

const form = document.querySelector<HTMLFormElement>('#lead-form');

if (form) {
  form.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();

    const btn = form.querySelector<HTMLButtonElement>('.lead-submit')!;
    const originalText = btn.textContent;
    btn.textContent = 'Отправка...';
    btn.disabled = true;

    const name = (form.querySelector('#lead-name') as HTMLInputElement).value.trim();
    const phone = (form.querySelector('#lead-phone') as HTMLInputElement).value.trim();
    const comment = (form.querySelector('#lead-comment') as HTMLTextAreaElement).value.trim();

    const isResolved = (v: string | null) => v && !v.includes('{') && !v.includes('}');
    const get = (k: string) => {
      const v = urlParams.get(k);
      return isResolved(v) ? v : null;
    };

    let text = `📩 <b>Новая заявка (МодульМеталл)</b>\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}`;
    if (comment) {
      text += `\n📝 Комментарий: ${comment}`;
    }
    text += `\n\n🔗 ${window.location.pathname}`;

    const source = get('utm_source');
    const medium = get('utm_medium');

    if (source) text += `\n📊 ${source}${medium ? ' / ' + medium : ''}`;

    const shown = new Set(['utm_source', 'utm_medium']);
    for (const [key, raw] of urlParams) {
      if (shown.has(key)) continue;
      if (!isResolved(raw)) continue;
      text += `\n🏷 ${key}: ${raw}`;
    }

    if (utmSearch) text += `\n\n🔗 ${utmLandingPath}${utmSearch}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
      });

      if (!res.ok) throw new Error('Telegram API error');

      localStorage.removeItem('mm_utm');
      form.innerHTML =
        '<p class="text-center type-body text-primary font-semibold py-8">✓ Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>';
    } catch {
      btn.textContent = originalText;
      btn.disabled = false;

      if (!form.querySelector('.lead-error')) {
        const err = document.createElement('p');
        err.className = 'lead-error text-red-600 type-caption text-center mt-2';
        err.textContent = `Не удалось отправить. Позвоните нам: +7 (4012) 99 40 40 или напишите в Telegram: ${TELEGRAM_HANDLE}`;
        form.appendChild(err);
      }
    }
  });
}
