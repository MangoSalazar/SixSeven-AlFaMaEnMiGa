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
    document.getElementById('btnExportar').addEventListener('click', exportarLista);
    
    document.getElementById('btnLimpiarFiltros').addEventListener('click', () => {
        document.getElementById('campo-busqueda').value = '';
        document.getElementById('filtro-periodo').value = '';
        document.getElementById('filtro-carrera').value = '';
        document.getElementById('filtro-estatus').value = '';
        ocultarResultados();
    });

    document.getElementById('campo-busqueda').addEventListener('keydown', e => {
        if (e.key === 'Enter') buscarAlumnos();
    });
});

function mostrarToast(tipo, msg) {
    if (toastTimer) clearTimeout(toastTimer);
    const estilos = {
        success: { icon: 'check_circle', color: '#0a7a52', bg: '#e6faf3', border: '#9aded3' },
        error:   { icon: 'error',        color: '#b03030', bg: '#fdeaea', border: '#f5b0b0' },
        info:    { icon: 'info',         color: '#004aa0', bg: '#e4f4ff', border: '#a8d8f5' }
    };
    const s = estilos[tipo];
    const toast = document.getElementById('toast');
    
    toast.style.cssText = `background:${s.bg}; border:1px solid ${s.border}; color:${s.color};`;
    document.getElementById('toastIcon').textContent = s.icon;
    document.getElementById('toastIcon').style.color = s.color;
    document.getElementById('toastMsg').textContent = msg;
    
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}

function ocultarResultados() {
    document.getElementById('estadoVacio').style.display = 'flex';
    document.getElementById('contenedorTabla').style.display = 'none';
    document.getElementById('estadoSinResultados').style.display = 'none';
    document.getElementById('btnExportar').style.display = 'none';
    document.getElementById('contadorResultados').textContent = '—';
    resultadosActivos = [];
}

async function buscarAlumnos() {
    const busqueda = document.getElementById('campo-busqueda').value.trim().toLowerCase();
    const periodo  = document.getElementById('filtro-periodo').value;
    const carrera  = document.getElementById('filtro-carrera').value;
    const estatus  = document.getElementById('filtro-estatus').value;

    const btn       = document.getElementById('btnBuscar');
    const spinner   = document.getElementById('spinnerBuscar');
    const icono     = document.getElementById('iconoBuscar');
    const texto     = document.getElementById('textoBuscar');
    
    btn.disabled = true;
    spinner.style.display = 'block';
    icono.style.display   = 'none';
    texto.textContent     = 'Buscando...';

    try {
        // ── INTENTO 1: Consumir el endpoint del backend ──
        const params = new URLSearchParams();
        if (busqueda) params.append('q', busqueda);
        if (periodo)  params.append('periodo', periodo);
        if (carrera)  params.append('carrera', carrera);
        if (estatus)  params.append('estatus', estatus);

        try {
            const res = await fetch(`${API_URL}?${params.toString()}`);
            if (res.ok) {
                const datos = await res.json();
                renderizarResultados(datos);
                return; 
            }
        } catch (backendErr) {
            console.warn("Backend no disponible aún. Cambiando a datos Mock locales...");
        }

        // ── INTENTO 2: Fallback al Mock si el backend falla ──
        await new Promise(r => setTimeout(r, 700)); 
        const datos = ALUMNOS_MOCK.filter(a => {
            const coincideBusqueda = !busqueda ||
                a.nombre.toLowerCase().includes(busqueda) ||
                a.matricula.includes(busqueda);
            const coincidePeriodo = !periodo || a.periodo === periodo;
            const coincideCarrera = !carrera || a.carrera === carrera;
            const coincideEstatus = !estatus || a.estatus === estatus;
            return coincideBusqueda && coincidePeriodo && coincideCarrera && coincideEstatus;
        });

        renderizarResultados(datos);

    } catch (err) {
        mostrarToast('error', 'Ocurrió un error inesperado al buscar.');
        console.error('[ACADEX alumnos-carrera]', err);
    } finally {
        btn.disabled = false;
        spinner.style.display = 'none';
        icono.style.display   = 'inline';
        texto.textContent     = 'Buscar alumnos';
    }
}

function renderizarResultados(datos) {
    resultadosActivos = datos;

    const estadoVacio       = document.getElementById('estadoVacio');
    const contenedorTabla   = document.getElementById('contenedorTabla');
    const estadoSinResult   = document.getElementById('estadoSinResultados');
    const contador          = document.getElementById('contadorResultados');
    const btnExportar       = document.getElementById('btnExportar');

    estadoVacio.style.display = 'none';

    if (datos.length === 0) {
        contenedorTabla.style.display = 'none';
        estadoSinResult.style.display = 'flex';
        contador.textContent = '0 resultados';
        btnExportar.style.display = 'none';
        return;
    }

    estadoSinResult.style.display = 'none';
    contenedorTabla.style.display = 'block';
    contador.textContent = `${datos.length} alumno${datos.length !== 1 ? 's' : ''} encontrado${datos.length !== 1 ? 's' : ''}`;
    btnExportar.style.display = 'inline-flex';

    const cuerpo = document.getElementById('cuerpoTabla');
    cuerpo.innerHTML = datos.map(a => {
        const claseEstatus = {
            'Vigente':  'estatus-vigente',
            'Egresado': 'estatus-egresado',
            'Baja':     'estatus-baja'
        }[a.estatus] || '';
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

// ── Funcion para Exportar / Imprimir──
function exportarLista() {
    if (resultadosActivos.length === 0) {
        mostrarToast('info', 'No hay resultados para exportar.');
        return;
    }

    const ventana = window.open('', '_blank');
    const ahora   = new Date();
    const fechaHoy = ahora.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
    const horaHoy  = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    const labelPeriodo = document.getElementById('filtro-periodo').value || 'Todos';
    const selCarrera   = document.getElementById('filtro-carrera');
    const labelCarrera = selCarrera.options[selCarrera.selectedIndex].text;
    const labelEstatus = document.getElementById('filtro-estatus').value || 'Todos';
    const labelBusqueda = document.getElementById('campo-busqueda').value.trim() || '—';

    const folio = `ITM-${ahora.getFullYear()}${String(ahora.getMonth()+1).padStart(2,'0')}${String(ahora.getDate()).padStart(2,'0')}-${String(resultadosActivos.length).padStart(3,'0')}`;

    const filas = resultadosActivos.map((a, i) => {
        const estiloEstatus = {
            'Vigente':  'background:#e6faf3; color:#0a7a52; border:1px solid #9aded3;',
            'Egresado': 'background:#e4f4ff; color:#004aa0; border:1px solid #a8d8f5;',
            'Baja':     'background:#fdeaea; color:#b03030; border:1px solid #f5b0b0;'
        }[a.estatus] || 'background:#f0f0f0; color:#444;';

        return `
        <tr style="${i % 2 === 0 ? '' : 'background:#f8faff;'}">
            <td style="text-align:center; font-weight:600; color:#0C1631;">${i + 1}</td>
            <td style="font-weight:700; color:#0C1631; letter-spacing:0.02em;">${a.matricula}</td>
            <td>${a.nombre}</td>
            <td style="color:#4a5672;">${a.carreraLabel}</td>
            <td style="color:#4a5672;">${a.periodo}</td>
            <td style="text-align:center;">
                <span style="display:inline-block; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:0.04em; ${estiloEstatus}">${a.estatus}</span>
            </td>
        </tr>`;
    }).join('');
    
    const logoRealHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
        <img src="../../assets/AcadexLogo.png" alt="ACADEX Logo" style="width: 38px; height: 38px; object-fit: contain;">
        <div>
            <div style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 800; color: #0C1631; letter-spacing: 1px;">ACADEX</div>
            <div style="font-family: Arial, sans-serif; font-size: 8px; font-weight: 400; color: #4a5672; letter-spacing: 0.5px;">Sistema Académico</div>
        </div>
    </div>`;

    ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Padrón de Alumnos — ACADEX · ${folio}</title>
        <style>
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 11.5px;
                color: #1a1a2e;
                background: #fff;
                padding: 28px 32px 24px;
                line-height: 1.5;
            }
            .header { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 16px; border-bottom: 3px solid #0C1631; margin-bottom: 14px; }
            .header-left { display: flex; align-items: center; gap: 14px; }
            .header-inst { font-size: 10px; color: #4a5672; line-height: 1.6; margin-top: 4px; }
            .header-inst strong { display: block; font-size: 11.5px; color: #0C1631; font-weight: 700; }
            .header-right { text-align: right; }
            .folio-badge { display: inline-block; background: #0062FF; color: white; font-size: 9.5px; font-weight: 700; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 4px; margin-bottom: 6px; }
            .fecha-gen { font-size: 9.5px; color: #8892aa; }
            .titulo-reporte { background: linear-gradient(135deg, #0C1631 0%, #1a2a55 60%, #0062FF 100%); color: white; padding: 14px 20px; border-radius: 8px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; }
            .titulo-reporte h1 { font-size: 15px; font-weight: 800; letter-spacing: -0.02em; color: white; }
            .titulo-reporte .subtitulo { font-size: 10px; color: rgba(255,255,255,0.6); margin-top: 2px; }
            .titulo-reporte .total-badge { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; white-space: nowrap; }
            .filtros-panel { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
            .filtro-item { background: #f8faff; border: 1px solid #e0e4ee; border-left: 3px solid #4DB0FF; border-radius: 6px; padding: 7px 10px; }
            .filtro-item .filtro-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #8892aa; margin-bottom: 2px; }
            .filtro-item .filtro-valor { font-size: 11px; font-weight: 600; color: #0C1631; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 18px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 6px rgba(12,22,49,0.08); }
            thead tr { background: #0C1631; }
            th { padding: 10px 12px; text-align: left; font-size: 9.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.75); }
            th:first-child  { color: rgba(255,255,255,0.4); text-align: center; width: 36px; }
            th:nth-child(2) { color: #4DB0FF; }
            td { padding: 9px 12px; border-bottom: 1px solid #edf0f7; font-size: 11px; vertical-align: middle; }
            tbody tr:last-child td { border-bottom: none; }
            .table-wrapper { border-top: 3px solid #0062FF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(12,22,49,0.08); margin-bottom: 18px; }
            .pie { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #e0e4ee; font-size: 9.5px; color: #8892aa; }
            .pie .disclaimer { display: flex; align-items: center; gap: 6px; }
            .pie .lock-icon { width: 12px; height: 12px; fill: #8892aa; }
            .pie .pagina { font-weight: 600; color: #4a5672; }
            @media print {
                body { padding: 18px 22px 16px; }
                .table-wrapper { box-shadow: none; }
                .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="header-left">
                ${logoRealHTML}
                <div class="header-inst">
                    <strong>Instituto Tecnológico de Los Mochis</strong>
                    Tecnológico Nacional de México · Dirección de Servicios Escolares<br>
                    Sistema de Información Académica ACADEX v1.0
                </div>
            </div>
            <div class="header-right">
                <div class="folio-badge">FOLIO: ${folio}</div>
                <div class="fecha-gen">Generado: ${fechaHoy} &nbsp;·&nbsp; ${horaHoy} hrs</div>
            </div>
        </div>

        <div class="titulo-reporte">
            <div>
                <h1>Padrón de Alumnos</h1>
                <div class="subtitulo">Reporte de consulta — Solo lectura · No oficial sin sello institucional</div>
            </div>
            <div class="total-badge">${resultadosActivos.length} registro${resultadosActivos.length !== 1 ? 's' : ''}</div>
        </div>

        <div class="filtros-panel">
            <div class="filtro-item">
                <div class="filtro-label">Búsqueda</div>
                <div class="filtro-valor" title="${labelBusqueda}">${labelBusqueda}</div>
            </div>
            <div class="filtro-item">
                <div class="filtro-label">Periodo</div>
                <div class="filtro-valor">${labelPeriodo}</div>
            </div>
            <div class="filtro-item">
                <div class="filtro-label">Carrera</div>
                <div class="filtro-valor" title="${labelCarrera}">${labelCarrera}</div>
            </div>
            <div class="filtro-item">
                <div class="filtro-label">Estatus</div>
                <div class="filtro-valor">${labelEstatus}</div>
            </div>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Núm. de Control</th>
                        <th>Nombre del Alumno</th>
                        <th>Carrera</th>
                        <th>Periodo</th>
                        <th style="text-align:center;">Estatus</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        </div>

        <div class="pie">
            <div class="disclaimer">
                <svg class="lock-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                Documento generado automáticamente por ACADEX · Confidencial · Uso interno
            </div>
            <div class="pagina">ITM · Servicios Escolares · ${fechaHoy}</div>
        </div>

        <script>
            // Un pequeño retraso para asegurar que la imagen local cargue antes de lanzar el diálogo de impresión
            window.onload = () => { setTimeout(() => { window.print(); }, 200); }
        </script>
    </body>
    </html>
    `);
    ventana.document.close();

    mostrarToast('success', 'Reporte institucional enviado a impresión.');
}