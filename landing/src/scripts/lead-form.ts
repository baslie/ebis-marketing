/**
 * Lead form → Web3Forms handler.
 *
 * Static site (Astro SSG) on GitHub Pages — no server runtime.
 * Submissions are delivered via email through web3forms.com.
 */

import { WEB3FORMS_KEY, YM_ID, PHONE_MIN_DIGITS, PHONE_MAX_DIGITS } from '../data/constants';
import { readUtm, clearUtm } from './utm';

const utm = readUtm();

// --- Validation helpers ---
function showFieldError(field: HTMLElement, message: string) {
  field.classList.add('border-red-500');
  const existing = field.parentElement?.querySelector('.field-error');
  if (existing) {
    existing.textContent = message;
  } else {
    const err = document.createElement('p');
    err.className = 'field-error text-red-600 type-caption mt-1';
    err.textContent = message;
    field.insertAdjacentElement('afterend', err);
  }
}

function clearFieldError(field: HTMLElement) {
  field.classList.remove('border-red-500');
  field.parentElement?.querySelector('.field-error')?.remove();
}

function validatePhone(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Введите номер телефона';
  if (/[^0-9\s()\-+.]/.test(trimmed)) return 'Телефон содержит недопустимые символы';
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < PHONE_MIN_DIGITS) return 'Номер слишком короткий';
  if (digits.length > PHONE_MAX_DIGITS) return 'Номер слишком длинный';
  return null;
}

const form = document.querySelector<HTMLFormElement>('#lead-form');

if (form) {
  const phoneInput = form.querySelector<HTMLInputElement>('#lead-phone')!;
  const consentInput = form.querySelector<HTMLInputElement>('[name="consent"]')!;
  const consentLabel = consentInput.closest('label')!;

  phoneInput.addEventListener('input', () => clearFieldError(phoneInput));
  consentInput.addEventListener('change', () => clearFieldError(consentLabel));

  form.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();

    const name = (form.querySelector('#lead-name') as HTMLInputElement).value.trim();
    const phone = phoneInput.value.trim();
    const comment = (form.querySelector('#lead-comment') as HTMLTextAreaElement).value.trim();

    // Validate
    clearFieldError(phoneInput);
    clearFieldError(consentLabel);

    const phoneError = validatePhone(phone);
    if (phoneError) {
      showFieldError(phoneInput, phoneError);
      phoneInput.focus();
      return;
    }
    if (!consentInput.checked) {
      showFieldError(consentLabel, 'Необходимо дать согласие');
      return;
    }

    const btn = form.querySelector<HTMLButtonElement>('.lead-submit')!;
    const originalText = btn.textContent;
    btn.textContent = 'Отправка...';
    btn.disabled = true;

    const isResolved = (v: string | null) => v && !v.includes('{') && !v.includes('}');

    const payload: Record<string, string> = {
      access_key: WEB3FORMS_KEY,
      subject: 'Новая заявка (МодульМеталл)',
      from_name: 'МодульМеталл',
      botcheck: '',
      name,
      phone,
    };
    if (comment) payload.comment = comment;
    payload.landing_page = window.location.pathname;

    for (const [key, raw] of utm.params) {
      if (!isResolved(raw)) continue;
      payload[key] = raw;
    }
    if (utm.search) payload.landing_url = utm.landingPath + utm.search;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Web3Forms error');

      clearUtm();
      if (typeof window.ym === 'function') {
        window.ym(YM_ID, 'reachGoal', 'lead_form_submit');
      }
      form.innerHTML =
        '<p class="text-center type-body text-green-600 font-semibold py-8">✓ Заявка отправлена! Мы&nbsp;свяжемся с&nbsp;вами в&nbsp;ближайшее время.</p>';
    } catch {
      btn.textContent = originalText;
      btn.disabled = false;

      const errorEl = form.querySelector<HTMLElement>('#lead-error');
      if (errorEl) {
        const phone = form.dataset.phone || '+7 (4012) 99 40 40';
        errorEl.textContent = `Не\u00A0удалось отправить. Позвоните нам: ${phone}`;
        errorEl.classList.remove('hidden');
      }
    }
  });
}
