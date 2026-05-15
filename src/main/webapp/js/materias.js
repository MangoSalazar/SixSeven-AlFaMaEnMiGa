'use strict';

// ── Constantes ────────────────────────────────────────────────
const ENDPOINT = '/api/materias';
const REGEX_CLAVE = /^[A-Z]{2,6}-\d{1,5}$/;

// ── Referencias DOM ───────────────────────────────────────────
const campoClave    = document.getElementById('campo-clave');
const campoNombre   = document.getElementById('campo-nombre');
const campoCreditos = document.getElementById('campo-creditos');
const campoSemestre = document.getElementById('campo-semestre');

const wrapClave     = document.getElementById('wrap-clave');
const wrapNombre    = document.getElementById('wrap-nombre');
const wrapCreditos  = document.getElementById('wrap-creditos');
const wrapSemestre  = document.getElementById('wrap-semestre');

const errorClave    = document.getElementById('error-clave');
const errorNombre   = document.getElementById('error-nombre');
const errorCreditos = document.getElementById('error-creditos');
const errorSemestre = document.getElementById('error-semestre');

const hintClave     = document.getElementById('hint-clave');
const counterNombre = document.getElementById('counter-nombre');

const vdotClave     = document.getElementById('vdot-clave');
const vdotNombre    = document.getElementById('vdot-nombre');
const vdotCreditos  = document.getElementById('vdot-creditos');
const vdotSemestre  = document.getElementById('vdot-semestre');

const jsonPreview   = document.getElementById('jsonPreview');
const btnGuardar    = document.getElementById('btnGuardar');
const btnLimpiar    = document.getElementById('btnLimpiar');
const btnSpinner    = document.getElementById('btnSpinner');
const btnIcon       = document.getElementById('btnIcon');
const btnText       = document.getElementById('btnText');
const toast         = document.getElementById('toast');
const toastIcon     = document.getElementById('toastIcon');
const toastMsg      = document.getElementById('toastMsg');

// ── Helpers de estado visual ──────────────────────────────────

function setOk(wrap, errorEl, hintEl, dot) {
  wrap.classList.remove('is-error');
  wrap.classList.add('is-success');
  errorEl.style.display = 'none';
  errorEl.textContent = '';
  if (hintEl) hintEl.style.display = 'inline';
  if (dot) { dot.classList.remove('err'); dot.classList.add('ok'); }
}

function setErr(wrap, errorEl, hintEl, dot, msg) {
  wrap.classList.add('is-error');
  wrap.classList.remove('is-success');
  errorEl.textContent = msg;
  errorEl.style.display = 'inline';
  if (hintEl) hintEl.style.display = 'none';
  if (dot) { dot.classList.remove('ok'); dot.classList.add('err'); }
}

function clearState(wrap, errorEl, hintEl, dot) {
  wrap.classList.remove('is-error', 'is-success');
  errorEl.style.display = 'none';
  errorEl.textContent = '';
  if (hintEl) hintEl.style.display = 'inline';
  if (dot) { dot.classList.remove('ok', 'err'); }
}

// ── Validadores individuales ──────────────────────────────────

function validarClave() {
  const val = campoClave.value.trim();
  if (!val)
    return setErr(wrapClave, errorClave, hintClave, vdotClave, 'La clave es obligatoria.'), false;
  if (val.length > 15)
    return setErr(wrapClave, errorClave, hintClave, vdotClave, 'Máximo 15 caracteres.'), false;
  if (!REGEX_CLAVE.test(val))
    return setErr(wrapClave, errorClave, hintClave, vdotClave, 'Formato inválido. Ej: ACF-123'), false;
  setOk(wrapClave, errorClave, hintClave, vdotClave);
  return true;
}

function validarNombre() {
  const val = campoNombre.value.trim();
  if (!val)
    return setErr(wrapNombre, errorNombre, null, vdotNombre, 'El nombre es obligatorio.'), false;
  if (val.length < 3)
    return setErr(wrapNombre, errorNombre, null, vdotNombre, 'Mínimo 3 caracteres.'), false;
  if (val.length > 100)
    return setErr(wrapNombre, errorNombre, null, vdotNombre, 'Máximo 100 caracteres.'), false;
  setOk(wrapNombre, errorNombre, null, vdotNombre);
  return true;
}

function validarCreditos() {
  const raw = campoCreditos.value;
  const val = parseInt(raw, 10);
  if (raw === '')
    return setErr(wrapCreditos, errorCreditos, null, vdotCreditos, 'Los créditos son obligatorios.'), false;
  if (isNaN(val) || val < 1)
    return setErr(wrapCreditos, errorCreditos, null, vdotCreditos, 'Debe ser un entero mayor a 0.'), false;
  if (val > 20)
    return setErr(wrapCreditos, errorCreditos, null, vdotCreditos, 'El máximo permitido es 20.'), false;
  setOk(wrapCreditos, errorCreditos, null, vdotCreditos);
  return true;
}

function validarSemestre() {
  if (!campoSemestre.value)
    return setErr(wrapSemestre, errorSemestre, null, vdotSemestre, 'Selecciona un semestre.'), false;
  setOk(wrapSemestre, errorSemestre, null, vdotSemestre);
  return true;
}

// ── Contador de caracteres (Nombre) ───────────────────────────

function actualizarContador() {
  const len = campoNombre.value.length;
  counterNombre.textContent = `${len} / 100`;
  counterNombre.className = 'char-count' +
    (len >= 100 ? ' over' : len >= 80 ? ' warn' : '');
}

// ── Preview JSON en tiempo real ───────────────────────────────

function actualizarPreview() {
  const payload = {
    clave:             campoClave.value.trim().toUpperCase()   || 'ACF-123',
    nombre:            campoNombre.value.trim()                || 'Nombre asignatura',
    creditos:          parseInt(campoCreditos.value, 10)       || 0,
    semestre_sugerido: parseInt(campoSemestre.value, 10)       || 0
  };
  jsonPreview.textContent = JSON.stringify(payload, null, 2);
}

// ── Construcción del payload real ─────────────────────────────

function construirPayload() {
  return {
    clave:             campoClave.value.trim().toUpperCase(),
    nombre:            campoNombre.value.trim(),
    creditos:          parseInt(campoCreditos.value, 10),
    semestre_sugerido: parseInt(campoSemestre.value, 10)
  };
}

// ── Toast ─────────────────────────────────────────────────────

let toastTimer = null;
const TOAST_STYLES = {
  success: { icon: 'check_circle', cls: 'alert-success', color: '#0a7a52', bg: '#e6faf3', border: '#9aded3' },
  error:   { icon: 'error',        cls: 'alert-danger',  color: '#b03030', bg: '#fdeaea', border: '#f5b0b0' },
  info:    { icon: 'info',         cls: 'alert-info',    color: '#004aa0', bg: '#e4f4ff', border: '#a8d8f5' }
};

function mostrarToast(tipo, msg) {
  if (toastTimer) clearTimeout(toastTimer);
  const s = TOAST_STYLES[tipo];
  toast.style.cssText = `
    background:${s.bg}; border:1px solid ${s.border}; color:${s.color};
    opacity:0; transform:translateY(14px); pointer-events:none;
  `;
  toastIcon.textContent = s.icon;
  toastIcon.style.color = s.color;
  toastMsg.textContent = msg;
  // forzar reflow antes de aplicar clase
  toast.offsetHeight;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}

// ── Estado del botón Guardar ──────────────────────────────────

function setBtnLoading(on) {
  btnGuardar.disabled = on;
  btnSpinner.style.display = on ? 'block' : 'none';
  btnIcon.style.display    = on ? 'none'  : 'inline';
  btnText.textContent      = on ? 'Guardando…' : 'Confirmar Alta';
}

// ── Envío al backend ──────────────────────────────────────────

async function enviarAlBackend(payload) {
  setBtnLoading(true);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      mostrarToast('success', `Materia "${payload.nombre}" registrada con éxito.`);
      limpiarFormulario();
    } else {
      const data = await res.json().catch(() => ({}));
      mostrarToast('error', data.message || `Error del servidor: ${res.status}`);
    }
  } catch (err) {
    mostrarToast('error', 'No se pudo conectar con el servidor. Verifica que el backend esté activo.');
    console.error('[ACADEX materias]', err);
  } finally {
    setBtnLoading(false);
  }
}

// ── Limpiar formulario ────────────────────────────────────────

function limpiarFormulario() {
  campoClave.value    = '';
  campoNombre.value   = '';
  campoCreditos.value = '';
  campoSemestre.value = '';
  [
    [wrapClave,    errorClave,    hintClave, vdotClave],
    [wrapNombre,   errorNombre,   null,      vdotNombre],
    [wrapCreditos, errorCreditos, null,      vdotCreditos],
    [wrapSemestre, errorSemestre, null,      vdotSemestre]
  ].forEach(args => clearState(...args));
  actualizarContador();
  actualizarPreview();
}

// ── Event Listeners ───────────────────────────────────────────

// Clave → mayúsculas en tiempo real + validación + preview
campoClave.addEventListener('input', () => {
  const pos = campoClave.selectionStart;
  campoClave.value = campoClave.value.toUpperCase();
  campoClave.setSelectionRange(pos, pos);
  validarClave();
  actualizarPreview();
});

campoNombre.addEventListener('input', () => {
  actualizarContador();
  validarNombre();
  actualizarPreview();
});

campoCreditos.addEventListener('input', () => {
  validarCreditos();
  actualizarPreview();
});

campoSemestre.addEventListener('change', () => {
  validarSemestre();
  actualizarPreview();
});

// Botón Guardar
btnGuardar.addEventListener('click', () => {
  const ok = [validarClave(), validarNombre(), validarCreditos(), validarSemestre()].every(Boolean);
  if (!ok) {
    mostrarToast('error', 'Corrige los campos marcados antes de continuar.');
    return;
  }
  enviarAlBackend(construirPayload());
});

// Botón Limpiar
btnLimpiar.addEventListener('click', () => {
  limpiarFormulario();
  mostrarToast('info', 'Formulario limpiado.');
});

// Enter en cualquier campo
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !btnGuardar.disabled) btnGuardar.click();
});

// Preview inicial
actualizarPreview();