export function afficherEcran(id) {
  document.querySelectorAll('.ecran').forEach(e => e.classList.add('cache'));
  const el = document.getElementById(id);
  if (el) el.classList.remove('cache');
}
