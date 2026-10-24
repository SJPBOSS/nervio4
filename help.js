import { COUNTRIES, suggestCountry } from '/scripts/helplines.js';

const openButton = document.getElementById('help-open');
const dialog = document.getElementById('help-dialog');
const select = document.getElementById('help-country');
const closeButton = document.getElementById('help-close');

if (openButton && dialog && select) {
  const known = COUNTRIES.map((country) => country.iso);

  function apply(iso) {
    const chosen = known.includes(iso) ? iso : '';
    for (const section of dialog.querySelectorAll('.help-country')) {
      section.hidden = Boolean(chosen) && section.dataset.iso !== chosen;
    }
    select.value = chosen;
  }

  let detected = '';
  try {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    detected = suggestCountry(languages, timeZone, known);
  } catch {
    detected = '';
  }
  apply(detected);

  openButton.addEventListener('click', () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    select.focus();
  });

  closeButton?.addEventListener('click', () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  });

  select.addEventListener('change', () => {
    apply(select.value);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && typeof dialog.close === 'function') dialog.close();
  });

  if (location.hash === '#help') openButton.click();
}
