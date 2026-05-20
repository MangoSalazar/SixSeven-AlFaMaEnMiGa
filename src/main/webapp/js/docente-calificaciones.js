document.addEventListener('DOMContentLoaded', () => {
    // 1. LEER SESIÓN ACTIVA DEL PERSONAL (DOCENTE/COORDINADOR)
    let session = JSON.parse(localStorage.getItem('acadex_session'));

    // Respaldo preventivo por si abren la vista suelta en desarrollo
    if (!session) {
        session = {
            nombre: "Alejandro Juárez",
            identificador: "DOC-2026"
        };
    }

    
    document.getElementById('topbarName').textContent = session.nombre;
    document.getElementById('topbarControl').textContent = "Emp: " + session.identificador;

    // Generar las iniciales del avatar en caliente (Ej: "Alejandro Juárez" -> "AJ")
    const iniciales = session.nombre
        .split(' ')
        .map(palabra => palabra.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    document.getElementById('topbarAvatar').textContent = iniciales;


    // 2. PARSEO DE PARÁMETROS URL Y CONTROL DATA-DRIVEN
    const urlParams = new URLSearchParams(window.location.search);
    const idAsignacion = urlParams.get('id_asignacion');
    const materiaTitle = document.getElementById('materiaTitle');

    // Matriz de datos simulados mapeando llaves primarias de la base de datos
    const baseEstudiantes = {
        '1': {
            titulo: "Materia: Estructura de Datos (AED-1283)",
            alumnos: [
                { id_kardex: 101, control: "20210634", nombre: "Fabián Montes", calificacion: 95.0, estatus: "Aprobada" },
                { id_kardex: 102, control: "20210635", nombre: "Alfredo Jiménez", calificacion: 58.5, estatus: "Reprobada" }
            ]
        },
        '2': {
            titulo: "Materia: Programación Web (TCH-1024)",
            alumnos: [
                { id_kardex: 201, control: "20210701", nombre: "Jorge Omar", calificacion: 88.0, estatus: "Aprobada" },
                { id_kardex: 202, control: "20210702", nombre: "Gael Alejandro", calificacion: 92.5, estatus: "Aprobada" }
            ]
        }
    };

    // Evaluamos el grupo seleccionado de forma reactiva
    const grupoSeleccionado = baseEstudiantes[idAsignacion] || baseEstudiantes['1'];
    
    if (materiaTitle) {
        materiaTitle.textContent = grupoSeleccionado.titulo;
    }
    renderizarAlumnos(grupoSeleccionado.alumnos);
});


function renderizarAlumnos(listaAlumnos) {
    const tbody = document.getElementById('tablaAlumnos');
    if (!tbody) return;
    tbody.innerHTML = "";

    listaAlumnos.forEach(alumno => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id-kardex', alumno.id_kardex); // clave primaria 
        
        const badgeClass = alumno.estatus === 'Aprobada' ? 'approved' : 'reproved';

        tr.innerHTML = `
            <td class="font-bold text-prussian">${alumno.control}</td>
            <td>${alumno.nombre}</td>
            <td style="text-align: center;">
                <input type="number" class="table-input-score" min="0" max="100" step="0.1" value="${alumno.calificacion.toFixed(1)}" oninput="validarFila(this)">
            </td>
            <td style="text-align: center;">
                <span class="status-badge ${badgeClass}">${alumno.estatus}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 4. VALIDACIÓN DE CALIFICACIONES INSTITUCIONALES EN TIEMPO REAL
function validarFila(input) {
    let score = parseFloat(input.value);
    const row = input.closest('tr');
    const badge = row.querySelector('.status-badge');
    
    if (isNaN(score) || input.value === "") {
        badge.textContent = "-";
        badge.className = "status-badge";
        return;
    }

    // Regla de negocio del Tec: 70 es la mínima aprobatoria
    if (score >= 70) {
        badge.textContent = "Aprobada";
        badge.className = "status-badge approved";
    } else {
        badge.textContent = "Reprobada";
        badge.className = "status-badge reproved";
    }
}

//  5. SIMULACIÓN DE ENVÍO DE CALIFICACIONES (Solo muestra alerta por ahora)
function enviarCalificaciones() {
    console.log("Compilando paquete transaccional de calificaciones...");
    alert("¡Calificaciones guardadas localmente con éxito!");
}