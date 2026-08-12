<script>
  import { fly, fade } from 'svelte/transition';
  import {
    emptyForm,
    submitForm,
    REQUEST_TYPES,
    BUDGET_RANGES,
    TIMELINES
  } from '$scripts/pages/contact.js';
  import './page.css';

  let form = $state(emptyForm());
  let errors = $state({});
  let submitting = $state(false);
  let result = $state(null); // { ok, message }

  async function handleSubmit(event) {
    event.preventDefault();
    submitting = true;
    result = null;

    const outcome = await submitForm(form);

    if (outcome.ok) {
      result = { ok: true, message: outcome.message };
      errors = {};
      form = emptyForm();
    } else {
      result = { ok: false, message: outcome.message };
      errors = outcome.fields ?? {};
    }

    submitting = false;
  }

  /** Clear a field's error as soon as the person starts correcting it. */
  function clearError(field) {
    if (errors[field]) {
      const { [field]: _, ...rest } = errors;
      errors = rest;
    }
  }
</script>

<svelte:head>
  <title>Contact | DDarty</title>
  <meta name="description" content="Request a commissioned painting or ask about available work." />
</svelte:head>

<div class="contact">
  <header class="contact__head shell">
    <span class="eyebrow">Commissions</span>
    <h1 class="contact__title">Get your custom piece</h1>
    <p class="contact__lede">
      Tell me what you have in mind. I reply to everything within two business
      days, including the requests I am not the right fit for.
    </p>
  </header>

  <div class="contact__body shell">
    <form class="form" onsubmit={handleSubmit} novalidate>
      {#if result}
        <div
          class="form__banner"
          class:form__banner--ok={result.ok}
          class:form__banner--bad={!result.ok}
          role="status"
          in:fly={{ y: -8, duration: 300 }}
        >
          {result.message}
        </div>
      {/if}

      <div class="form__row">
        <div class="field">
          <label class="field__label" for="name">Your name</label>
          <input
            id="name"
            class="field__input"
            class:field__input--bad={errors.name}
            type="text"
            bind:value={form.name}
            oninput={() => clearError('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {#if errors.name}
            <p class="field__error" id="name-error" in:fade={{ duration: 160 }}>{errors.name}</p>
          {/if}
        </div>

        <div class="field">
          <label class="field__label" for="email">Email</label>
          <input
            id="email"
            class="field__input"
            class:field__input--bad={errors.email}
            type="email"
            bind:value={form.email}
            oninput={() => clearError('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {#if errors.email}
            <p class="field__error" id="email-error" in:fade={{ duration: 160 }}>{errors.email}</p>
          {/if}
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="phone">
          Phone <span class="field__optional">optional</span>
        </label>
        <input id="phone" class="field__input" type="tel" bind:value={form.phone} />
      </div>

      <div class="form__row form__row--three">
        <div class="field">
          <label class="field__label" for="requestType">What are you after</label>
          <select id="requestType" class="field__input" bind:value={form.requestType}>
            {#each REQUEST_TYPES as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <div class="field">
          <label class="field__label" for="budgetRange">Budget</label>
          <select id="budgetRange" class="field__input" bind:value={form.budgetRange}>
            {#each BUDGET_RANGES as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <div class="field">
          <label class="field__label" for="timeline">Timing</label>
          <select id="timeline" class="field__input" bind:value={form.timeline}>
            {#each TIMELINES as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="message">What do you have in mind</label>
        <textarea
          id="message"
          class="field__input field__input--area"
          class:field__input--bad={errors.message}
          rows="6"
          bind:value={form.message}
          oninput={() => clearError('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        ></textarea>
        {#if errors.message}
          <p class="field__error" id="message-error" in:fade={{ duration: 160 }}>{errors.message}</p>
        {/if}
      </div>

      <!-- Honeypot: hidden from people, irresistible to bots. -->
      <div class="form__trap" aria-hidden="true">
        <label for="website">Website</label>
        <input id="website" type="text" tabindex="-1" autocomplete="off" bind:value={form.website} />
      </div>

      <button class="btn btn--solid form__submit" type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send request'}
      </button>
    </form>

    <aside class="aside">
      <h2 class="aside__title">What to expect</h2>
      <ol class="aside__steps">
        <li class="aside__step">
          <span class="aside__step-label">First</span>
          A reply within two business days, with questions if I have them.
        </li>
        <li class="aside__step">
          <span class="aside__step-label">Then</span>
          A short call or email thread to pin down size, subject, and price.
        </li>
        <li class="aside__step">
          <span class="aside__step-label">Then</span>
          Two or three small studies before any large work begins.
        </li>
        <li class="aside__step">
          <span class="aside__step-label">Finally</span>
          Six to ten weeks of painting, with progress photos along the way.
        </li>
      </ol>

      <div class="aside__note">
        <p>
          Prefer email? Write directly to
          <a class="link-accent" href="mailto:studio@adaroswell.com">studio@adaroswell.com</a>.
        </p>
      </div>
    </aside>
  </div>
</div>
