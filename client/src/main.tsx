// ATOMIC main.tsx - NO IMPORTS
alert('MAIN.TSX ATOMIC START');
const statusEl = document.getElementById('status');
if (statusEl) {
  statusEl.innerText = 'MAIN.TSX ATOMIC EXECUTED';
  statusEl.style.background = 'magenta';
  statusEl.style.color = 'white';
}
console.log('[TMA] atomic main.tsx executed');
