/**
 * scripts/pages/contact.js
 *
 * All contact-form behaviour that isn't markup: validation rules, payload
 * shaping, and the submit lifecycle. The Svelte component imports these and
 * stays limited to rendering plus event binding.
 *
 * Keeping it here means the rules are unit-testable without mounting a
 * component, and the same logic can back a different form later.
 */

import { api, ApiError } from '$lib/api/client.js';

export const REQUEST_TYPES = [
  { value: 'original', label: 'An original piece' },
  { value: 'commission', label: 'A commission from a photo' },
  { value: 'print', label: 'A print of existing work' },
  { value: 'other', label: 'Something else' }
];

export const BUDGET_RANGES = [
  { value: 'under-500', label: 'Under $500' },
  { value: '500-1500', label: '$500 – $1,500' },
  { value: '1500-4000', label: '$1,500 – $4,000' },
  { value: 'over-4000', label: 'Over $4,000' },
  { value: 'unsure', label: 'Not sure yet' }
];

export const TIMELINES = [
  { value: 'no-rush', label: 'No particular deadline' },
  { value: 'within-3-months', label: 'Within three months' },
  { value: 'specific-date', label: 'I have a date in mind' }
];

/** Shape of a blank form. */
export function emptyForm() {
  return {
    name: '',
    email: '',
    phone: '',
    message: '',
    requestType: 'original',
    budgetRange: 'unsure',
    timeline: 'no-rush',
    website: '' // honeypot; stays empty for real people
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Client-side validation. Mirrors the server's bean-validation constraints so
 * people get immediate feedback, but the server remains the authority.
 *
 * @returns {Record<string, string>} field name -> message, empty when valid
 */
export function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Enter your name';
  } else if (form.name.trim().length > 120) {
    errors.name = 'Name is too long';
  }

  if (!form.email.trim()) {
    errors.email = 'Enter your email address';
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!form.message.trim()) {
    errors.message = 'Tell us a little about what you have in mind';
  } else if (form.message.trim().length > 4000) {
    errors.message = 'Message is too long';
  }

  return errors;
}

/**
 * Submit the form.
 *
 * Returns a discriminated result rather than throwing, so the component can
 * render every outcome without a try/catch in the template layer.
 *
 * @returns {Promise<{ok: true, message: string} | {ok: false, message: string, fields: Record<string,string>}>}
 */
export async function submitForm(form) {
  const errors = validate(form);
  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: 'Check the highlighted fields and try again.',
      fields: errors
    };
  }

  try {
    // The centralized inquiry DTO is intentionally flat (name/email/phone/
    // company/message/subject/website). Fold Ddarty's commission selects into
    // a readable preamble on the message, and use the request type as subject.
    const requestLabel =
        REQUEST_TYPES.find((o) => o.value === form.requestType)?.label ?? 'Inquiry';
    const budgetLabel =
        BUDGET_RANGES.find((o) => o.value === form.budgetRange)?.label ?? '';
    const timelineLabel =
        TIMELINES.find((o) => o.value === form.timeline)?.label ?? '';

    const preamble =
        `Request: ${requestLabel}\n` +
        `Budget: ${budgetLabel}\n` +
        `Timeline: ${timelineLabel}\n\n`;

    const response = await api.submitInquiry({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: '',
      message: preamble + form.message.trim(),
      subject: `Commission enquiry — ${requestLabel}`,
      website: form.website
    });

    return {
      ok: true,
      message: response?.message ?? 'Thanks — your request is in.'
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message,
        fields: error.body?.fields ?? {}
      };
    }
    return {
      ok: false,
      message: 'Something went wrong. Try again in a moment.',
      fields: {}
    };
  }
}
