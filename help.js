import { COUNTRIES, suggestCountry } from '/scripts/helplines.js';

const openButton = document.getElementById('help-open');
const dialog = document.getElementById('help-dialog');
const select = document.getElementById('help-country');
const closeButton = document.getElementById('help-close');

if (openButton && dialog && select) {
  const known = COUNTRIES.map((country) => country.iso);
  const defaults = (dialog.dataset.helpDefault || '').split(/\s+/).filter((iso) => known.includes(iso));
  const list = document.getElementById('help-list');
  if (defaults.length && list) {
    for (const iso of [...defaults].reverse()) {
      const section = list.querySelector(`.help-country[data-iso="${iso}"]`);
      if (section) list.prepend(section);
    }
  }

  function apply(value) {
    const showAll = value === '*' || (value === '' && defaults.length === 0);
    const chosen = known.includes(value) ? value : '';
    for (const section of dialog.querySelectorAll('.help-country')) {
      if (showAll) section.hidden = false;
      else if (chosen) section.hidden = section.dataset.iso !== chosen;
      else section.hidden = !defaults.includes(section.dataset.iso);
    }
    if (showAll && defaults.length) select.value = '*';
    else select.value = chosen;
  }

  if (defaults.length) {
    apply('');
  } else {
    let detected = '';
    try {
      const languages = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      detected = suggestCountry(languages, timeZone, known);
    } catch {
      detected = '';
    }
    apply(detected);
  }

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
