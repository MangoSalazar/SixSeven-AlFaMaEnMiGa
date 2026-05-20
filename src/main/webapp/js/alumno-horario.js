document.addEventListener('DOMContentLoaded', () => {
    // 1. LEER SESIÓN ACTIVA E INYECTAR EN LA TOPBAR
    let session = JSON.parse(localStorage.getItem('acadex_session'));

    
    if (!session) {
        session = {
            nombre: "Fabián Montes",
            identificador: "20210634"
        };
    }

    document.getElementById('topbarName').textContent = session.nombre;
    document.getElementById('topbarControl').textContent = session.identificador;


    const iniciales = session.nombre
        .split(' ')
        .map(palabra => palabra.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    document.getElementById('topbarAvatar').textContent = iniciales;


    const payloadHorario = [
        { clave: "AED-1283", materia: "Estructura de Datos", aula: "Aula L2", dias: "Lun - Vie", horas: "08:00 - 09:00", docente: "Ing. Maviles Torres", puesto: "Docente Titular", academia: "Sistemas y Computación" },
        { clave: "TCH-1024", materia: "Programación Web", aula: "Laboratorio C", dias: "Lun - Vie", horas: "12:00 - 13:00", docente: "M.C. Alfredo Jiménez", puesto: "Docente Técnico", academia: "Sistemas y Computación" }
    ];

    renderizarHorario(payloadHorario);
});

function renderizarHorario(listaHorarios) {
    const tbody = document.getElementById('tablaHorario');
    if (!tbody) return;
    tbody.innerHTML = "";

    listaHorarios.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-bold text-prussian">${item.clave}</td>
            <td>${item.materia}</td>
            <td>${item.aula}</td>
            <td>${item.dias}</td>
            <td>${item.horas}</td>
            <td style="text-align: center; vertical-align: middle;">
                <button class="btn-table-action" style="display: inline-flex; align-items: center; justify-content: center; width: auto; min-width: unset; padding: 0; margin: 0 auto; background: none; border: none; cursor: pointer;" onclick="abrirModalDocente('${item.docente}', '${item.puesto}', '${item.academia}')">
                    <span class="material-symbols-rounded" style="color: var(--sapphire); font-size: 1.35rem; display: block;">info</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalDocente(nombre, puesto, academia) {
    document.getElementById('modalNombreDocente').textContent = nombre;
    document.getElementById('modalPuestoDocente').textContent = puesto;
    document.getElementById('modalAcademiaDocente').textContent = academia;
    document.getElementById('modalDocente').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalDocente').style.display = 'none';
}

function cerrarModalExterno(event) {
    const modal = document.getElementById('modalDocente');
    if (event.target === modal) {
        cerrarModal();
    }
}