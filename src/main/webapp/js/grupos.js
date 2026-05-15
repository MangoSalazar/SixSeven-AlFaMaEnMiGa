'use strict';

// ── Constantes y Referencias ──────────────────────────────────
const ENDPOINT_HORARIOS = '/api/horarios';

const campoMateria = document.getElementById('campo-materia');
const campoDocente = document.getElementById('campo-docente');
const campoAula    = document.getElementById('campo-aula');
const campoPeriodo = document.getElementById('campo-periodo');
const campoDia     = document.getElementById('campo-dia');
const campoInicio  = document.getElementById('campo-inicio');
const campoFin     = document.getElementById('campo-fin');

const btnGuardar = document.getElementById('btnGuardar');
const btnLimpiar = document.getElementById('btnLimpiar');

// ── Toast Notificaciones ───────────────────────────────────────
let toastTimer = null;
const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toastIcon');
const toastMsg = document.getElementById('toastMsg');

function mostrarToast(tipo, msg) {
    if (toastTimer) clearTimeout(toastTimer);
    const s = {
        success: { icon: 'check_circle', color: '#0a7a52', bg: '#e6faf3', border: '#9aded3' },
        error:   { icon: 'error',        color: '#b03030', bg: '#fdeaea', border: '#f5b0b0' }
    }[tipo];
    
    toast.style.cssText = `background:${s.bg}; border:1px solid ${s.border}; color:${s.color};`;
    toastIcon.textContent = s.icon;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}

// ── Cargar Datos para los Selects───
async function cargarDatosFormulario() {
    try {
        /* codigo para el backend
        const [materias, docentes, aulas, periodos] = await Promise.all([
            fetch('/api/materias').then(r => r.json()),
            fetch('/api/docentes').then(r => r.json()),
            fetch('/api/aulas').then(r => r.json()),
            fetch('/api/periodos').then(r => r.json())
        ]);
        */
       // Datos simulados para pruebas sin backend
        const materias = [{id_materia: 1, nombre: "Cálculo Diferencial"}, {id_materia: 2, nombre: "Programación Web"}];
        const docentes = [{id_docente: 1, nombre: "Dr. Juan Pérez"}, {id_docente: 2, nombre: "Ing. María López"}];
        const aulas    = [{id_aula: 1, nombre_salon: "Lab A"}, {id_aula: 2, nombre_salon: "Edificio B - 12"}];
        const periodos = [{id_periodo: 1, nombre_ciclo: "Ene-Jun 2026"}];
         
        llenarSelect(campoMateria, materias, 'id_materia', 'nombre', 'Selecciona Materia');
        llenarSelect(campoDocente, docentes, 'id_docente', 'nombre', 'Selecciona Docente');
        llenarSelect(campoAula, aulas, 'id_aula', 'nombre_salon', 'Aula');
        llenarSelect(campoPeriodo, periodos, 'id_periodo', 'nombre_ciclo', 'Periodo');

    } catch (error) {
        mostrarToast('error', 'Error al cargar catálogos del servidor.');
    }
}

function llenarSelect(selectEl, datos, idKey, textKey, placeholder) {
    selectEl.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
    datos.forEach(item => {
        selectEl.innerHTML += `<option value="${item[idKey]}">${item[textKey]}</option>`;
    });
}

// ── Logica de Guardado ─────────────────────────────────────
btnGuardar.addEventListener('click', async () => {
    // Validar que no haya campos vacíos
    if (!campoMateria.value || !campoDocente.value || !campoAula.value || !campoPeriodo.value || !campoDia.value || !campoInicio.value || !campoFin.value) {
        mostrarToast('error', 'Todos los campos son obligatorios.');
        return;
    }

    if (campoInicio.value >= campoFin.value) {
        mostrarToast('error', 'La hora de inicio debe ser menor a la hora de fin.');
        return;
    }

    const payload = {
        id_materia: parseInt(campoMateria.value),
        id_docente: parseInt(campoDocente.value),
        id_aula:    parseInt(campoAula.value),
        id_periodo: parseInt(campoPeriodo.value),
        dia_semana: campoDia.value,
        hora_inicio: campoInicio.value + ':00',
        hora_fin:    campoFin.value + ':00'
    };

    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    btnGuardar.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline-block';

    try {
        const res = await fetch(ENDPOINT_HORARIOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            mostrarToast('success', 'Grupo y horario asignados correctamente.');
            btnLimpiar.click();
        } else {
            mostrarToast('error', 'Error al registrar el grupo en el servidor.');
        }
    } catch (err) {
        mostrarToast('error', 'Sin conexión al servidor.');
    } finally {
        btnGuardar.disabled = false;
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
    }
});

btnLimpiar.addEventListener('click', () => {
    document.getElementById('formGrupo').reset();
});

// Inicializar
cargarDatosFormulario();