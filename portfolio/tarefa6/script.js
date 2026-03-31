const b             = document.getElementById('b');
const avatarImg     = document.getElementById('avatar-img');
const statusTxt     = document.getElementById('status-txt');
const barraFome     = document.getElementById('barra-fome');
const criaturaWrap  = document.getElementById('criatura-wrap');
const overlay       = document.getElementById('overlay-morte');
const btnReiniciar  = document.getElementById('btn-reiniciar');
const bandeja       = document.getElementById('bandeja');
const slotComida    = document.getElementById('slot-comida');
const dragClone     = document.getElementById('drag-clone');
const dragCloneImg  = dragClone.querySelector('img');
const tela          = document.getElementById('tela-jogo');

const estados = {
  normal:      'criatura.png',
  bravo:       'criatura_brava.png',
  morto:       'criatura_morta.png',
  comendo:     'criatura_comendo.png',
  alimentada:  'criatura_alimentada.png',
};

const fundoDia   = 'bg_dia.svg';
const fundoNoite = 'bg_noite.svg';

const TEMPO_BRAVO   = 30;
const TEMPO_MORTO   = 60;
const TEMPO_COMENDO = 1;
const TEMPO_FELIZ   = 2;

let contador    = 0;
let estado      = 'normal';
let intervalo   = null;
let timeComendo = null;
let horasCiclo  = 0;
let intervaloFundo = null;

function iniciar() {
  contador = 0;
  estado   = 'normal';

  btnReiniciar.style.display = 'none';
  bandeja.style.display      = 'flex';
  overlay.classList.remove('ativo');
  criaturaWrap.classList.remove('morta');
  slotComida.classList.remove('invisivel');

  aplicarEstado('normal');
  atualizarBarra();

  if (intervalo)   clearInterval(intervalo);
  if (timeComendo) clearTimeout(timeComendo);

  intervalo = setInterval(() => {
    if (estado === 'comendo' || estado === 'alimentada' || estado === 'morto') return;

    contador++;
    atualizarBarra();

    if (contador >= TEMPO_MORTO) {
      morrer();
    } else if (contador >= TEMPO_BRAVO) {
      aplicarEstado('bravo');
    }
  }, 1000);
}

function aplicarEstado(novoEstado) {
  b.classList.remove('pulsando', 'tremendo', 'comendo-anim', 'feliz-anim');
  estado = novoEstado;
  b.src  = estados[novoEstado];
  avatarImg.src = estados[novoEstado];

  switch (novoEstado) {
    case 'normal':
      statusTxt.textContent = 'NORMAL';
      b.classList.add('pulsando');
      break;
    case 'bravo':
      statusTxt.textContent = 'COM FOME ⚠';
      b.classList.add('tremendo');
      break;
    case 'comendo':
      statusTxt.textContent = 'COMENDO...';
      b.classList.add('comendo-anim');
      break;
    case 'alimentada':
      statusTxt.textContent = 'FELIZ! ♥';
      b.classList.add('feliz-anim');
      break;
    case 'morto':
      statusTxt.textContent = 'MORTO ✖';
      criaturaWrap.classList.add('morta');
      break;
  }
}

function morrer() {
  clearInterval(intervalo);
  aplicarEstado('morto');
  overlay.classList.add('ativo');
  bandeja.style.display      = 'none';
  btnReiniciar.style.display = 'block';
  atualizarBarra();
}

function alimentar() {
  if (estado === 'morto') return;

  contador = 0;
  atualizarBarra();
  emitirParticulas();

  if (timeComendo) clearTimeout(timeComendo);

  aplicarEstado('comendo');

  timeComendo = setTimeout(() => {
    aplicarEstado('alimentada');

    timeComendo = setTimeout(() => {
      aplicarEstado('normal');
    }, TEMPO_FELIZ * 1000);

  }, TEMPO_COMENDO * 1000);
}

function atualizarBarra() {
  const pct = Math.max(0, Math.round((1 - contador / TEMPO_MORTO) * 100));
  barraFome.value = pct;

  barraFome.className = 'progress w-full';
  if (pct > 50) {
    barraFome.classList.add('progress-warning');
  } else if (pct > 20) {
    barraFome.classList.add('progress-error');
  } else {
    barraFome.classList.add('progress-error');
  }
}

function emitirParticulas() {
  const icones = ['⚙', '🔩', '✨', '⚡', '♥'];
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className    = 'particula';
      p.textContent  = icones[Math.floor(Math.random() * icones.length)];
      p.style.left   = (155 + Math.random() * 110) + 'px';
      p.style.bottom = (185 + Math.random() * 70)  + 'px';
      tela.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }, i * 100);
  }
}

function alternarFundo() {
  const noite = document.getElementById('toggle-noite').checked;
  document.body.style.backgroundImage = noite
    ? `url('${fundoNoite}')`
    : `url('${fundoDia}')`;
}

function atualizarFundo() {
  if (intervaloFundo) clearInterval(intervaloFundo);

  intervaloFundo = setInterval(() => {
    horasCiclo++;

    if (horasCiclo >= 12 && !document.getElementById('toggle-noite').checked) {
      document.getElementById('toggle-noite').checked = true;
      alternarFundo();
    }

    if (horasCiclo >= 24) {
      horasCiclo = 0;
      document.getElementById('toggle-noite').checked = false;
      alternarFundo();
    }
  }, 5000);
}

let arrastando = false;

slotComida.addEventListener('mousedown', (e) => {
  if (estado === 'morto') return;
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
    arrastando = true;
    slotComida.classList.add('invisivel');
    dragCloneImg.src = 'comida.png';
    dragClone.style.display = 'block';
    moverClone(e.clientX, e.clientY);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
  }
});

function onMouseMove(e) {
  moverClone(e.clientX, e.clientY);
  const rect = criaturaWrap.getBoundingClientRect();
  const sobre =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top  && e.clientY <= rect.bottom;
  criaturaWrap.classList.toggle('drag-over', sobre);
}

function onMouseUp(e) {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup',   onMouseUp);
  dragClone.style.display = 'none';
  slotComida.classList.remove('invisivel');
  criaturaWrap.classList.remove('drag-over');
  arrastando = false;

  const rect = criaturaWrap.getBoundingClientRect();
  const sobre =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top  && e.clientY <= rect.bottom;
  if (sobre) alimentar();
}

slotComida.addEventListener('touchstart', (e) => {
  if (estado === 'morto') return;
  e.preventDefault();
  const t = e.touches[0];
  slotComida.classList.add('invisivel');
  dragClone.style.display = 'block';
  moverClone(t.clientX, t.clientY);
}, { passive: false });

slotComida.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  moverClone(t.clientX, t.clientY);
  const rect = criaturaWrap.getBoundingClientRect();
  const sobre =
    t.clientX >= rect.left && t.clientX <= rect.right &&
    t.clientY >= rect.top  && t.clientY <= rect.bottom;
  criaturaWrap.classList.toggle('drag-over', sobre);
}, { passive: false });

slotComida.addEventListener('touchend', (e) => {
  e.preventDefault();
  const t = e.changedTouches[0];
  dragClone.style.display = 'none';
  slotComida.classList.remove('invisivel');
  criaturaWrap.classList.remove('drag-over');
  const rect = criaturaWrap.getBoundingClientRect();
  const sobre =
    t.clientX >= rect.left && t.clientX <= rect.right &&
    t.clientY >= rect.top  && t.clientY <= rect.bottom;
  if (sobre) alimentar();
}, { passive: false });

function moverClone(x, y) {
  dragClone.style.left = x + 'px';
  dragClone.style.top  = y + 'px';
}

alternarFundo();
iniciar();
atualizarFundo();
