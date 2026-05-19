'use strict';

// Falta definir elendpoint exacto
const API_URL = '/api/alumnos';

// Mock de respaldo mientras el backend esta listo
const ALUMNOS_MOCK = [
    { matricula: '20210634', nombre: 'Fabián Montes Corrales', carrera: 'ISC', carreraLabel: 'Ing. en Sistemas Computacionales', periodo: 'Ago-Dic 2026', estatus: 'Vigente' },
    { matricula: '20210635', nombre: 'Alfredo Jiménez Germán', carrera: 'ISC', carreraLabel: 'Ing. en Sistemas Computacionales', periodo: 'Ago-Dic 2026', estatus: 'Vigente' },
    { matricula: '20210636', nombre: 'Gael Pacheco López', carrera: 'ISC', carreraLabel: 'Ing. en Sistemas Computacionales', periodo: 'Ago-Dic 2026', estatus: 'Vigente' },
    { matricula: '20210701', nombre: 'Jorge Omar Valdez', carrera: 'II', carreraLabel: 'Ing. Industrial', periodo: 'Ene-Jun 2026', estatus: 'Vigente' },
    { matricula: '20190412', nombre: 'Laura Martínez Ibarra', carrera: 'II', carreraLabel: 'Ing. Industrial', periodo: 'Ago-Dic 2025', estatus: 'Baja' }
];

let resultadosActivos = [];
let toastTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnBuscar').addEventListener('click', buscarAlumnos);
    document.getElementById('btnLimpiarFiltros').addEventListener('click', limpiarFiltros);
    document.getElementById('btnExportar').addEventListener('click', exportarLista);
    document.getElementById('campo-busqueda').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarAlumnos();
        }
    });
});

function mostrarToast(tipo, msg) {
    if (toastTimer) clearTimeout(toastTimer);
    const estilos = {
        success: { icon: 'check_circle', color: '#0a7a52', bg: '#e6faf3', border: '#9aded3' },
        error:   { icon: 'error',        color: '#b03030', bg: '#fdeaea', border: '#f5b0b0' },
        info:    { icon: 'info',         color: '#004aa0', bg: '#e4f4ff', border: '#a8d8f5' }
    };
    const s = estilos[tipo] || estilos.info;
    const toast = document.getElementById('toast');
    
    toast.style.cssText = `background:${s.bg}; border:1px solid ${s.border}; color:${s.color};`;
    document.getElementById('toastIcon').textContent = s.icon;
    document.getElementById('toastIcon').style.color = s.color;
    document.getElementById('toastMsg').textContent = msg;
    
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}

function limpiarFiltros() {
    document.getElementById('campo-busqueda').value = '';
    document.getElementById('filtro-periodo').value = '';
    document.getElementById('filtro-carrera').value = '';
    document.getElementById('filtro-estatus').value = '';
    
    document.getElementById('estadoVacio').style.display = 'flex';
    document.getElementById('contenedorTabla').style.display = 'none';
    document.getElementById('estadoSinResultados').style.display = 'none';
    document.getElementById('btnExportar').style.display = 'none';
    document.getElementById('contadorResultados').textContent = '—';
    resultadosActivos = [];
}

async function buscarAlumnos() {
    const busqueda = document.getElementById('campo-busqueda').value.trim();
    const periodo  = document.getElementById('filtro-periodo').value;
    const carrera  = document.getElementById('filtro-carrera').value;
    const estatus  = document.getElementById('filtro-estatus').value;

    const btn = document.getElementById('btnBuscar');
    const spinner = document.getElementById('spinnerBuscar');
    const icono = document.getElementById('iconoBuscar');
    const texto = document.getElementById('textoBuscar');

    // UI de Carga
    btn.disabled = true;
    spinner.style.display = 'block';
    icono.style.display = 'none';
    texto.textContent = 'Buscando...';

    try {
        // parametros de consulta
        const params = new URLSearchParams();
        if (busqueda) params.append('query', busqueda);
        if (periodo) params.append('periodo', periodo);
        if (carrera) params.append('carrera', carrera);
        if (estatus) params.append('estatus', estatus);

        let datos = [];

        // Conexiopn al backend (simulado con mock ya que aun no se implementa)
        try {
            const response = await fetch(`${API_URL}?${params.toString()}`);
            if (response.ok) {
                datos = await response.json();
            } else {
                throw new Error('Servidor respondió con error');
            }
        } catch (backendError) {
            console.warn("Usando datos Mock (Simulados).");
            await new Promise(r => setTimeout(r, 600)); 
            const lowerBusqueda = busqueda.toLowerCase();
            
            datos = ALUMNOS_MOCK.filter(a => {
                const matchQuery = !busqueda || a.nombre.toLowerCase().includes(lowerBusqueda) || a.matricula.includes(busqueda);
                const matchPeriodo = !periodo || a.periodo === periodo;
                const matchCarrera = !carrera || a.carrera === carrera;
                const matchEstatus = !estatus || a.estatus === estatus;
                return matchQuery && matchPeriodo && matchCarrera && matchEstatus;
            });
        }

        renderizarTabla(datos);

    } catch (error) {
        mostrarToast('error', 'Ocurrió un error al realizar la búsqueda.');
        console.error('Error en búsqueda:', error);
    } finally {
        btn.disabled = false;
        spinner.style.display = 'none';
        icono.style.display = 'inline';
        texto.textContent = 'Buscar alumnos';
    }
}

function renderizarTabla(datos) {
    resultadosActivos = datos;

    document.getElementById('estadoVacio').style.display = 'none';

    if (datos.length === 0) {
        document.getElementById('contenedorTabla').style.display = 'none';
        document.getElementById('estadoSinResultados').style.display = 'flex';
        document.getElementById('contadorResultados').textContent = '0 resultados';
        document.getElementById('btnExportar').style.display = 'none';
        return;
    }

    document.getElementById('estadoSinResultados').style.display = 'none';
    document.getElementById('contenedorTabla').style.display = 'block';
    document.getElementById('contadorResultados').textContent = `${datos.length} alumno(s)`;
    document.getElementById('btnExportar').style.display = 'inline-flex';

    const cuerpo = document.getElementById('cuerpoTabla');
    cuerpo.innerHTML = datos.map(a => {
        const claseEstatus = a.estatus === 'Vigente' ? 'estatus-vigente' 
                           : a.estatus === 'Egresado' ? 'estatus-egresado' 
                           : 'estatus-baja';
        return `
            <tr>
                <td class="font-bold">${a.matricula}</td>
                <td>${a.nombre}</td>
                <td>${a.carreraLabel}</td>
                <td>${a.periodo}</td>
                <td style="text-align: center;">
                    <span class="estatus-badge ${claseEstatus}">${a.estatus}</span>
                </td>
            </tr>
        `;
    }).join('');
}

function exportarLista() {
    if (resultadosActivos.length === 0) return;

    const ventana = window.open('', '_blank');
    const fechaHoy = new Date().toLocaleDateString('es-MX');

    const filas = resultadosActivos.map(a => `
        <tr><td>${a.matricula}</td><td>${a.nombre}</td><td>${a.carreraLabel}</td><td>${a.periodo}</td><td>${a.estatus}</td></tr>
    `).join('');

    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <title>Padrón de Alumnos — ACADEX</title>
            <style>
                body { font-family: Arial; font-size: 12px; margin: 30px; }
                h1 { color: #0C1631; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th { background: #0C1631; color: white; text-align: left; padding: 8px; }
                td { padding: 8px; border-bottom: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <h1>Padrón de Alumnos</h1>
            <p>Generado el: ${fechaHoy} | Total: ${resultadosActivos.length} alumnos</p>
            <table>
                <thead><tr><th>Matrícula</th><th>Nombre</th><th>Carrera</th><th>Periodo</th><th>Estatus</th></tr></thead>
                <tbody>${filas}</tbody>
            </table>
            <script>window.onload=()=>window.print();<\/script>
        </body>
        </html>
    `);
    ventana.document.close();
    mostrarToast('success', 'Lista enviada a impresión.');
}