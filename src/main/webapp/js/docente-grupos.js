document.addEventListener('DOMContentLoaded', () => {
    // 1. LEER SESIÓN ACTIVA DEL PERSONAL (DOCENTE/COORDINADOR)
    let session = JSON.parse(localStorage.getItem('acadex_session'));

    // Respaldo preventivo por si abren la vista de forma aislada
    if (!session) {
        session = {
            nombre: "Alejandro Juárez",
            identificador: "DOC-2026"
        };
    }

    
    document.getElementById('topbarName').textContent = session.nombre;
    document.getElementById('topbarControl').textContent = "Emp: " + session.identificador;

    // Generar iniciales automáticas 
    const iniciales = session.nombre
        .split(' ')
        .map(palabra => palabra.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    document.getElementById('topbarAvatar').textContent = iniciales;


    // 2. CARGA DE GRUPOS ASIGNADOS 
    const payloadGrupos = [
        { id_asignacion: 1, materia: "Estructura de Datos", clave: "AED-1283", aula: "Aula L2", horario: "08:00 - 09:00", alumnos: 28 },
        { id_asignacion: 2, materia: "Programación Web", clave: "TCH-1024", aula: "Laboratorio C", horario: "12:00 - 13:00", alumnos: 32 }
    ];

    renderizarGrupos(payloadGrupos);
});


function renderizarGrupos(grupos) {
    const tbody = document.getElementById('tablaGrupos');
    if (!tbody) return;
    tbody.innerHTML = "";

    grupos.forEach(grupo => {
        const tr = document.createElement('tr');
        tr.className = "table-row-selectable";
        tr.setAttribute('onclick', `seleccionarGrupo(${grupo.id_asignacion})`);
        
        tr.innerHTML = `
            <td class="font-bold text-prussian">${grupo.materia}</td>
            <td>${grupo.clave}</td>
            <td>${grupo.aula}</td>
            <td>${grupo.horario}</td>
            <td><span class="badge-count">${grupo.alumnos}</span></td>
            <td>
                <button class="btn-table-action">
                    <span class="material-symbols-rounded">chevron_right</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


function seleccionarGrupo(idAsignacion) {
    window.location.href = "alumnos-grupo.html?id_asignacion=" + idAsignacion;
}