'use strict';

const get = id => document.getElementById(id);
const key = (code, tr, us = tr, width = 1) => ({ code, tr, us, width });
const gap = width => ({ width });
const letters = characters => [...characters].map(letter => key('Key' + letter, letter));
const functionKeys = Array.from({ length: 12 }, (_, index) => key('F' + (index + 1), 'F' + (index + 1)));

const mainRows = [
  [key('Escape', 'Esc'), gap(.55), ...functionKeys.slice(0, 4), gap(.3), ...functionKeys.slice(4, 8), gap(.3), ...functionKeys.slice(8)],
  [key('Backquote', '"', '`'), ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => key('Digit' + n, String(n))), key('Minus', '*', '-'), key('Equal', '-', '='), key('Backspace', 'Sil', 'Backspace', 2)],
  [key('Tab', 'Tab', 'Tab', 1.5), ...letters('QWERTYU'), key('KeyI', 'I'), ...letters('OP'), key('BracketLeft', 'Ğ', '['), key('BracketRight', 'Ü', ']'), key('Backslash', ',', '\\', 1.5)],
  [key('CapsLock', 'Caps', 'Caps', 1.75), ...letters('ASDFGHJKL'), key('Semicolon', 'Ş', ';'), key('Quote', 'İ', "'"), key('Enter', 'Enter', 'Enter', 2.25)],
  [key('ShiftLeft', 'Shift', 'Shift', 2), key('IntlBackslash', '<'), ...letters('ZXCVBNM'), key('Comma', 'Ö', ','), key('Period', 'Ç', '.'), key('Slash', '.', '/'), key('ShiftRight', 'Shift', 'Shift', 2)],
  [key('ControlLeft', 'Ctrl', 'Ctrl', 1.3), key('MetaLeft', 'Meta', 'Meta', 1.3), key('AltLeft', 'Alt', 'Alt', 1.3), key('Space', 'Boşluk', 'Space', 6), key('AltRight', 'Alt Gr', 'Alt', 1.3), key('MetaRight', 'Meta', 'Meta', 1.1), key('ContextMenu', 'Menü', 'Menu', 1.1), key('ControlRight', 'Ctrl', 'Ctrl', 1.3)]
];

const navRows = [
  [key('PrintScreen', 'PrtSc'), key('ScrollLock', 'ScrLk'), key('Pause', 'Pause')],
  [key('Insert', 'Ins'), key('Home', 'Home'), key('PageUp', 'PgUp')],
  [key('Delete', 'Del'), key('End', 'End'), key('PageDown', 'PgDn')],
  [gap(1), gap(1), gap(1)],
  [gap(1), key('ArrowUp', '↑'), gap(1)],
  [key('ArrowLeft', '←'), key('ArrowDown', '↓'), key('ArrowRight', '→')]
];

const numberGrid = [
  [key('NumpadEqual', '='), 4, 1],
  [key('NumLock', 'Num'), 1, 2], [key('NumpadDivide', '/'), 2, 2], [key('NumpadMultiply', '*'), 3, 2], [key('NumpadSubtract', '−'), 4, 2],
  [key('Numpad7', '7'), 1, 3], [key('Numpad8', '8'), 2, 3], [key('Numpad9', '9'), 3, 3], [key('NumpadAdd', '+'), 4, 3, 1, 2],
  [key('Numpad4', '4'), 1, 4], [key('Numpad5', '5'), 2, 4], [key('Numpad6', '6'), 3, 4],
  [key('Numpad1', '1'), 1, 5], [key('Numpad2', '2'), 2, 5], [key('Numpad3', '3'), 3, 5], [key('NumpadEnter', 'Enter'), 4, 5, 1, 2],
  [key('Numpad0', '0'), 1, 6, 2], [key('NumpadDecimal', ',', '.'), 3, 6]
];

const namedKeys = {
  Space: ' ', AltLeft: 'Alt', AltRight: 'Alt', ControlLeft: 'Control', ControlRight: 'Control',
  ShiftLeft: 'Shift', ShiftRight: 'Shift', MetaLeft: 'Meta', MetaRight: 'Meta', NumpadEnter: 'Enter',
  ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown',
  NumpadSubtract: '-', NumpadAdd: '+', NumpadDivide: '/', NumpadMultiply: '*'
};
const keyNames = { ' ': 'Boşluk', Escape: 'Esc', Control: 'Ctrl', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Backspace: 'Backspace' };
const locations = ['Standart', 'Sol', 'Sağ', 'Sayısal'];
const layout = get('layout');
const keyboard = get('keyboard');
const caps = new Map();
let tabKey;

function displayLabel(item) {
  return item[layout.value];
}

function makeKey(item, functionRow = false) {
  const cap = document.createElement('button');
  cap.type = 'button';
  cap.className = 'keycap';
  cap.tabIndex = -1;
  cap.dataset.code = item.code;
  if (item.width > 1 || item.tr.length > 3 || item.us.length > 3) cap.dataset.wide = '';
  if (functionRow) cap.dataset.function = '';
  caps.set(item.code, { cap, item });
  return cap;
}

function makeRows(container, rows) {
  rows.forEach((items, rowIndex) => {
    const row = document.createElement('div');
    row.className = 'key-row';
    row.style.gridTemplateColumns = items.map(item => 'minmax(0, ' + item.width + 'fr)').join(' ');
    for (const item of items) {
      if (item.code) {
        row.append(makeKey(item, rowIndex === 0));
      } else {
        const spacer = document.createElement('span');
        spacer.className = 'key-gap';
        row.append(spacer);
      }
    }
    container.append(row);
  });
}

function refreshLayout() {
  for (const { cap, item } of caps.values()) {
    const label = displayLabel(item);
    cap.textContent = label;
    cap.title = item.code;
    cap.setAttribute('aria-label', label + ' · ' + item.code);
  }
}

function setTabKey(button) {
  if (tabKey) tabKey.tabIndex = -1;
  tabKey = button;
  tabKey.tabIndex = 0;
}

makeRows(get('main-keys'), mainRows);
makeRows(get('navigation-keys'), navRows);
for (const [item, column, row, width = 1, height = 1] of numberGrid) {
  const cap = makeKey(item, row === 1);
  cap.style.setProperty('--x', column);
  cap.style.setProperty('--y', row);
  cap.style.setProperty('--w', width);
  cap.style.setProperty('--h', height);
  get('numpad').append(cap);
}
setTabKey(caps.get('Escape').cap);
refreshLayout();
layout.addEventListener('change', refreshLayout);

const physicalHeld = new Set();
const simulatedHeld = new Map();
const demoTimers = new Set();
const eventList = get('events');
const eventTable = get('event-table');
const emptyHistory = get('history-empty');
const clearButton = get('clear');
const pauseButton = get('pause');
const demoButton = get('demo');
const listenState = get('listen-state');
const lastKey = get('last-key');
const lastEvent = get('last-event');
const waveform = get('waveform');
const scope = waveform.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const pulses = [];
const period = 5000;
const startedAt = performance.now();
let paused = false;
let eventCount = 0;
let lastCode = '';
let traceFrame = 0;

function readableKey(value) {
  if (value === ' ') return '␣ (boşluk)';
  return value || '—';
}

function reflectHeld() {
  const held = new Set([...physicalHeld, ...simulatedHeld.keys()]);
  for (const [code, { cap }] of caps) cap.classList.toggle('is-held', held.has(code));
  get('held-count').textContent = held.size + ' tuş basılı';
}

function showEvent(event) {
  const outcome = event.type === 'up' ? 'Bırakıldı' : event.repeat ? 'Tekrar' : 'Basıldı';
  const keyLabel = keyNames[event.key] || event.key || '—';
  lastKey.textContent = keyLabel;
  lastKey.toggleAttribute('data-long', keyLabel.length > 3);
  lastEvent.textContent = outcome + ' · ' + event.source;
  get('event-key').textContent = readableKey(event.key);
  get('event-code').textContent = event.code || '—';
  get('event-location').textContent = locations[event.location] || 'Standart';
  get('event-modifiers').textContent = event.modifiers.join(' + ') || '—';
  caps.get(lastCode)?.cap.classList.remove('is-last');
  lastCode = event.code;
  caps.get(lastCode)?.cap.classList.add('is-last');
  if (event.type === 'down' && !event.repeat) {
    get('announcement').textContent = keyLabel + ', ' + (event.code || 'kod yok') + ', ' + event.source;
  }
  return outcome;
}

function appendEvent(event, outcome, now) {
  const row = document.createElement('tr');
  const time = ((now - startedAt) / 1000).toFixed(2).replace('.', ',') + ' s';
  for (const value of [time, outcome, readableKey(event.key), event.code || '—', event.source]) {
    const cell = document.createElement('td');
    cell.textContent = value;
    row.append(cell);
  }
  eventList.prepend(row);
  if (eventList.childElementCount > 12) eventList.lastElementChild.remove();
  eventCount++;
  get('event-count').textContent = eventCount + ' olay';
  emptyHistory.hidden = true;
  eventTable.hidden = false;
  clearButton.disabled = false;
}

function fitCanvas(canvas, context, maxScale) {
  const { width, height } = canvas.getBoundingClientRect();
  const scale = Math.min(devicePixelRatio || 1, maxScale);
  const pixelWidth = Math.round(width * scale);
  const pixelHeight = Math.round(height * scale);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  context.setTransform(scale, 0, 0, scale, 0, 0);
  return { width, height };
}

function paintWave(now) {
  if (!scope) return;
  const { width, height } = fitCanvas(waveform, scope, 2);
  const middle = height / 2;
  scope.clearRect(0, 0, width, height);
  scope.strokeStyle = '#74936a';
  scope.lineWidth = 1;
  scope.beginPath();
  scope.moveTo(0, middle);
  scope.lineTo(width, middle);
  scope.stroke();

  scope.lineWidth = 1.7;
  scope.lineJoin = 'round';
  while (pulses.length && now - pulses[0].time > period) pulses.shift();
  for (const pulse of pulses) {
    const x = Math.min(width - 6, width - (now - pulse.time) * width / period);
    const amplitude = pulse.type === 'up' ? height * .19 : -height * (pulse.repeat ? .23 : .34);
    scope.strokeStyle = pulse.type === 'up' ? '#83ae91' : '#c0df9d';
    scope.beginPath();
    scope.moveTo(x - 5, middle);
    scope.lineTo(x - 2, middle);
    scope.lineTo(x, middle + amplitude);
    scope.lineTo(x + 2, middle);
    scope.lineTo(x + 5, middle);
    scope.stroke();
  }
}

function animateWave(now) {
  traceFrame = 0;
  paintWave(now);
  if (pulses.length && !reducedMotion.matches) traceFrame = requestAnimationFrame(animateWave);
}

function record(event) {
  const now = performance.now();
  const outcome = showEvent(event);
  appendEvent(event, outcome, now);
  reflectHeld();
  pulses.push({ type: event.type, repeat: event.repeat, time: now });
  if (pulses.length > 160) pulses.shift();
  if (reducedMotion.matches) paintWave(now);
  else if (!traceFrame) traceFrame = requestAnimationFrame(animateWave);
}

function isControlActivation(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;
  if (target.matches('select, input, textarea, [contenteditable="true"]')) return true;
  return target.closest('button, a') && (event.key === 'Enter' || event.key === ' ');
}

function physicalEvent(event, type) {
  if (paused) return;
  const { key: pressed, code, repeat, location } = event;
  const id = code || pressed;
  if (event.defaultPrevented || isControlActivation(event)) {
    if (type === 'up' && physicalHeld.delete(id)) reflectHeld();
    return;
  }
  if (type === 'down') physicalHeld.add(id);
  else physicalHeld.delete(id);
  const modifiers = [];
  if (event.ctrlKey) modifiers.push('Ctrl');
  if (event.altKey) modifiers.push('Alt');
  if (event.shiftKey) modifiers.push('Shift');
  if (event.metaKey) modifiers.push('Meta');
  if (event.getModifierState('AltGraph')) modifiers.push('AltGr');
  record({ key: pressed, code, repeat, location, modifiers, type, source: 'Fiziksel' });
}

window.addEventListener('keydown', event => physicalEvent(event, 'down'));
window.addEventListener('keyup', event => physicalEvent(event, 'up'));
function releasePhysicalKeys() {
  physicalHeld.clear();
  reflectHeld();
}
window.addEventListener('blur', releasePhysicalKeys);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) releasePhysicalKeys();
});

function simulate(code) {
  if (paused || simulatedHeld.has(code)) return;
  const { item } = caps.get(code);
  const label = displayLabel(item);
  const language = layout.value === 'tr' ? 'tr-TR' : 'en-US';
  const value = code === 'AltRight' && layout.value === 'tr' ? 'AltGraph'
    : namedKeys[code] ?? (label.length === 1 ? label.toLocaleLowerCase(language) : code);
  const location = code.startsWith('Numpad') || code === 'NumLock' ? 3
    : code.endsWith('Left') && !code.startsWith('Arrow') ? 1
    : code.endsWith('Right') && !code.startsWith('Arrow') ? 2 : 0;
  const payload = { code, key: value, repeat: false, location, modifiers: [], source: 'Ekran' };
  const timer = window.setTimeout(() => {
    simulatedHeld.delete(code);
    record({ ...payload, type: 'up' });
  }, 135);
  simulatedHeld.set(code, timer);
  record({ ...payload, type: 'down' });
}

keyboard.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.target.closest('.keycap')) event.preventDefault();
});
keyboard.addEventListener('click', event => {
  const cap = event.target.closest('.keycap');
  if (!cap) return;
  setTabKey(cap);
  simulate(cap.dataset.code);
});
keyboard.addEventListener('focusin', event => {
  if (event.target.matches('.keycap')) setTabKey(event.target);
});

const arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
function center(button) {
  const rect = button.getBoundingClientRect();
  return [rect.x + rect.width / 2, rect.y + rect.height / 2];
}

keyboard.addEventListener('keydown', event => {
  const direction = arrows[event.key];
  if (!direction || !event.target.matches('.keycap')) return;
  event.preventDefault();
  const [dx, dy] = direction;
  const [x, y] = center(event.target);
  let nearest;
  let bestScore = Infinity;
  for (const { cap } of caps.values()) {
    const [nextX, nextY] = center(cap);
    const along = (nextX - x) * dx + (nextY - y) * dy;
    if (along < 3) continue;
    const across = Math.abs((nextX - x) * dy + (nextY - y) * dx);
    const score = along + across * 3;
    if (score < bestScore) {
      nearest = cap;
      bestScore = score;
    }
  }
  nearest?.focus({ preventScroll: true });
  nearest?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
});
keyboard.addEventListener('keyup', event => {
  if (arrows[event.key] && event.target.matches('.keycap')) event.preventDefault();
});

function stopDemo() {
  for (const timer of demoTimers) window.clearTimeout(timer);
  demoTimers.clear();
  for (const timer of simulatedHeld.values()) window.clearTimeout(timer);
  simulatedHeld.clear();
  demoButton.disabled = paused;
  reflectHeld();
}

demoButton.addEventListener('click', () => {
  if (paused || demoTimers.size) return;
  demoButton.disabled = true;
  ['KeyK', 'KeyL', 'Space', 'ArrowRight', 'Numpad5'].forEach((code, index) => {
    const timer = window.setTimeout(() => {
      demoTimers.delete(timer);
      simulate(code);
      if (!demoTimers.size) demoButton.disabled = false;
    }, 80 + index * 240);
    demoTimers.add(timer);
  });
});

pauseButton.addEventListener('click', () => {
  paused = !paused;
  if (paused) {
    physicalHeld.clear();
    stopDemo();
  } else {
    demoButton.disabled = false;
  }
  listenState.textContent = paused ? 'Duraklatıldı' : 'Dinleniyor';
  pauseButton.textContent = paused ? 'Devam et' : 'Duraklat';
});

clearButton.addEventListener('click', () => {
  stopDemo();
  eventCount = 0;
  pulses.length = 0;
  if (traceFrame) cancelAnimationFrame(traceFrame);
  traceFrame = 0;
  paintWave(performance.now());
  eventList.replaceChildren();
  eventTable.hidden = true;
  emptyHistory.hidden = false;
  get('event-count').textContent = '0 olay';
  clearButton.disabled = true;
  caps.get(lastCode)?.cap.classList.remove('is-last');
  lastCode = '';
  lastKey.textContent = '—';
  lastKey.removeAttribute('data-long');
  lastEvent.textContent = 'Bir tuşa bas.';
  for (const id of ['event-key', 'event-code', 'event-location', 'event-modifiers']) get(id).textContent = '—';
  get('announcement').textContent = 'Olay kaydı temizlendi.';
});

if ('ResizeObserver' in window) new ResizeObserver(() => paintWave(performance.now())).observe(waveform);
else window.addEventListener('resize', () => paintWave(performance.now()));
reducedMotion.addEventListener('change', () => {
  if (traceFrame) cancelAnimationFrame(traceFrame);
  animateWave(performance.now());
});
paintWave(startedAt);

const comet = get('comet');
const cometContext = comet.getContext('2d');
const finePointer = matchMedia('(any-hover: hover) and (any-pointer: fine)');
const points = [];
let cometFrame = 0;

function resetComet() {
  if (cometFrame) cancelAnimationFrame(cometFrame);
  cometFrame = 0;
  points.length = 0;
  cometContext?.clearRect(0, 0, comet.width, comet.height);
}

function drawComet(now) {
  cometFrame = 0;
  const { width, height } = fitCanvas(comet, cometContext, 1);
  cometContext.clearRect(0, 0, width, height);
  while (points.length && now - points[0].time >= 250) points.shift();
  if (!points.length) return;

  cometContext.lineCap = 'round';
  for (let index = 1; index < points.length; index++) {
    const start = points[index - 1];
    const end = points[index];
    const strength = Math.max(0, 1 - (now - start.time) / 250);
    cometContext.beginPath();
    cometContext.strokeStyle = 'rgba(255, 174, 91, ' + strength * .27 + ')';
    cometContext.lineWidth = 1 + strength * 2.5;
    cometContext.moveTo(start.x, start.y);
    cometContext.lineTo(end.x, end.y);
    cometContext.stroke();
  }
  const head = points.at(-1);
  const alpha = Math.max(0, 1 - (now - head.time) / 250);
  const glow = cometContext.createRadialGradient(head.x, head.y, 0, head.x, head.y, 8);
  glow.addColorStop(0, 'rgba(255, 188, 112, ' + alpha * .37 + ')');
  glow.addColorStop(1, 'rgba(255, 174, 91, 0)');
  cometContext.fillStyle = glow;
  cometContext.fillRect(head.x - 8, head.y - 8, 16, 16);
  cometFrame = requestAnimationFrame(drawComet);
}

window.addEventListener('pointermove', event => {
  if (!cometContext || !finePointer.matches || reducedMotion.matches || event.pointerType !== 'mouse') return;
  const previous = points.at(-1);
  const now = performance.now();
  if (previous && now - previous.time > 90) points.length = 0;
  else if (previous && Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < 4) return;
  points.push({ x: event.clientX, y: event.clientY, time: now });
  if (points.length > 16) points.shift();
  if (!cometFrame) cometFrame = requestAnimationFrame(drawComet);
}, { passive: true });
document.documentElement.addEventListener('pointerleave', resetComet);
window.addEventListener('blur', resetComet);
reducedMotion.addEventListener('change', resetComet);
finePointer.addEventListener('change', resetComet);
