document.addEventListener("DOMContentLoaded", () => {
    
    // --- Referencias UI ---
    const headerMateria = document.getElementById("header-materia");
    const headerDocente = document.getElementById("header-docente");
    const headerClaveGrupo = document.getElementById("header-clave-grupo");
    const headerPeriodo = document.getElementById("header-periodo");
    
    const listaDisponiblesEl = document.getElementById("lista-disponibles");
    const listaAsignadosEl = document.getElementById("lista-asignados");
    const badgeDisponibles = document.getElementById("badge-disponibles");
    const badgeAsignados = document.getElementById("badge-asignados");

    const inputBuscarDisponible = document.getElementById("buscar-disponible");
    const inputBuscarAsignado = document.getElementById("buscar-asignado");

    const toast = document.getElementById("toast");
    const toastIcon = document.getElementById("toastIcon");
    const toastMsg = document.getElementById("toastMsg");

    const CAPACIDAD_MAXIMA = 30;

    const urlParams = new URLSearchParams(window.location.search);
    const idGrupo = urlParams.get('idGrupo') || '1'; // IMPORTANTE: El backend de Milton espera un Integer (ej. 1, no 'G001')
    const nombreMateria = urlParams.get('materia') || 'Materia Desconocida';
    
    const API_BASE_URL = "http://localhost:8080/api";

    // Rellenar Encabezado
    headerMateria.textContent = `${idGrupo} - ${nombreMateria}`;
    headerClaveGrupo.textContent = `Grupo ${idGrupo}`;
    headerDocente.textContent = "Docente Asignado"; 
    headerPeriodo.textContent = "Ago-Dic 2026";

    // --- Variables de Estado (Ahora inician vacías para llenarse con la BD) ---
    let alumnosDisponibles = [];
    let alumnosAsignados = [];

    // --- Cargar datos iniciales ---
    async function cargarDatosBackend() {
        try {
            // 1. Obtener todos los alumnos inscritos en este grupo específico (GET /api/grupos-alumnos/{idGrupo}/alumnos)
            const resAsignados = await fetch(`${API_BASE_URL}/grupos-alumnos/${idGrupo}/alumnos`);
            if (resAsignados.ok) {
                alumnosAsignados = await resAsignados.json();
            }

            const resTodos = await fetch(`${API_BASE_URL}/alumnos`);
            if (resTodos.ok) {
                const todosLosAlumnos = await resTodos.json();
                
                const idsAsignados = alumnosAsignados.map(a => a.id_alumno || a.control);
                alumnosDisponibles = todosLosAlumnos.filter(a => !idsAsignados.includes(a.id_alumno || a.control));
            }

            // Si el backend aun no tiene datos usamos el mock de prueba:
            if (alumnosDisponibles.length === 0 && alumnosAsignados.length === 0) {
                console.warn("Usando datos de prueba porque la BD está vacía o inactiva.");
                alumnosDisponibles = [
                    { control: '20210634', nombre: 'Juan García López', carrera: 'ISC' },
                    { control: '20210855', nombre: 'María Fernanda Ruiz', carrera: 'ISC' },
                    { control: '20210912', nombre: 'Carlos Eduardo Soto', carrera: 'ISC' }
                ];
                alumnosAsignados = [
                    { control: '20210511', nombre: 'Jesús Antonio Beltrán', carrera: 'ISC' }
                ];
            }

            renderizarListas();

        } catch (error) {
            console.error("Error al cargar los datos de la BD:", error);
            mostrarToast("Error de red: No se pudo conectar con el servidor.", "error");
        }
    }

    // --- Funcion para renderizar ambas listas ---
    function renderizarListas(filtroDisp = "", filtroAsig = "") {
        // Filtrar arrays si hay texto en los buscadores
        const dispFiltrados = alumnosDisponibles.filter(a => 
            (a.nombre || '').toLowerCase().includes(filtroDisp.toLowerCase()) || 
            String(a.control || a.id_alumno || '').includes(filtroDisp)
        );
        
        const asigFiltrados = alumnosAsignados.filter(a => 
            (a.nombre || '').toLowerCase().includes(filtroAsig.toLowerCase()) || 
            String(a.control || a.id_alumno || '').includes(filtroAsig)
        );

        badgeDisponibles.textContent = `${alumnosDisponibles.length} encontrados`;
        badgeAsignados.textContent = `${alumnosAsignados.length} / ${CAPACIDAD_MAXIMA}`;

        if(alumnosAsignados.length >= CAPACIDAD_MAXIMA) {
            badgeAsignados.className = "badge badge-strawberry";
        } else {
            badgeAsignados.className = "badge badge-prussian";
        }

        // Render Panel Izquierdo (Disponibles)
        listaDisponiblesEl.innerHTML = "";
        if (dispFiltrados.length === 0) {
            listaDisponiblesEl.innerHTML = `<p class="text-muted text-center" style="padding: 20px;">No hay alumnos disponibles.</p>`;
        } else {
            dispFiltrados.forEach(alumno => {
                listaDisponiblesEl.appendChild(crearItemAlumno(alumno, 'disponible'));
            });
        }

        // Render Panel Derecho (Asignados)
        listaAsignadosEl.innerHTML = "";
        if (asigFiltrados.length === 0) {
            listaAsignadosEl.innerHTML = `<p class="text-muted text-center" style="padding: 20px;">El grupo está vacío.</p>`;
        } else {
            asigFiltrados.forEach(alumno => {
                listaAsignadosEl.appendChild(crearItemAlumno(alumno, 'asignado'));
            });
        }
    }

    // --- Crear elemento HTML de la lista ---
    function crearItemAlumno(alumno, tipo) {
        const div = document.createElement("div");
        div.style.border = "1px solid var(--border-light)";
        div.style.borderRadius = "var(--radius-md)";
        div.style.padding = "10px 14px";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "space-between";
        div.style.background = tipo === 'asignado' ? "var(--mint-bg)" : "var(--snow)";
        div.style.transition = "background var(--transition-fast)";

        div.onmouseover = () => div.style.background = "white";
        div.onmouseout = () => div.style.background = tipo === 'asignado' ? "var(--mint-bg)" : "var(--snow)";

        const idIdentificador = alumno.control || alumno.id_alumno || 'S/N';
        const carrera = alumno.carrera || 'ISC';

        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = `
            <div style="font-size: 13.5px; font-weight: 600; color: var(--prussian);">${alumno.nombre || 'Alumno Sin Nombre'}</div>
            <div style="font-size: 11.5px; color: var(--text-muted); display: flex; gap: 8px; margin-top: 2px;">
                <span>#${idIdentificador}</span>
                <span>• ${carrera}</span>
            </div>
        `;

        const actionBtn = document.createElement("button");
        if (tipo === 'disponible') {
            actionBtn.className = "btn btn-icon";
            actionBtn.style.color = "var(--sapphire)";
            actionBtn.innerHTML = `<span class="material-symbols-rounded">person_add</span>`;
            actionBtn.title = "Agregar al grupo";
            actionBtn.onclick = () => agregarAlumno(idIdentificador);
        } else {
            actionBtn.className = "btn btn-icon";
            actionBtn.style.color = "var(--strawberry)";
            actionBtn.style.borderColor = "var(--strawberry-border)";
            actionBtn.innerHTML = `<span class="material-symbols-rounded">person_remove</span>`;
            actionBtn.title = "Quitar del grupo";
            actionBtn.onclick = () => quitarAlumno(idIdentificador);
        }

        div.appendChild(infoDiv);
        div.appendChild(actionBtn);
        return div;
    }

    // --- Logica Alta de Alumno ---
    async function agregarAlumno(control) {
        if (alumnosAsignados.length >= CAPACIDAD_MAXIMA) {
            mostrarToast("Capacidad máxima del grupo alcanzada (30/30).", "error");
            return;
        }

        const index = alumnosDisponibles.findIndex(a => a.control === control || a.id_alumno === control);
        if (index > -1) {
            const alumno = alumnosDisponibles[index];

            try {
                // PETICIÓN REAL: POST /api/grupos-alumnos/{idGrupo}/alumnos/{idAlumno}
                const response = await fetch(`${API_BASE_URL}/grupos-alumnos/${idGrupo}/alumnos/${control}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Error en el servidor");
                }

                // UI Update
                alumnosDisponibles.splice(index, 1);
                alumnosAsignados.push(alumno);
                mostrarToast(`Alumno ${alumno.nombre} inscrito correctamente.`, "success");
                
                inputBuscarDisponible.value = "";
                renderizarListas("", inputBuscarAsignado.value);

            } catch (error) {
                console.error("Fallo al vincular alumno:", error);
                mostrarToast("No se pudo agregar al alumno en la BD.", "error");
            }
        }
    }

    // --- Logica Baja de Alumno ---
    async function quitarAlumno(control) {
        const index = alumnosAsignados.findIndex(a => a.control === control || a.id_alumno === control);
        if (index > -1) {
            const alumno = alumnosAsignados[index];

            try {
                const response = await fetch(`${API_BASE_URL}/grupos-alumnos/${idGrupo}/alumnos/${control}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Error en el servidor");
                }

                alumnosAsignados.splice(index, 1);
                alumnosDisponibles.push(alumno);
                mostrarToast(`Se dio de baja a ${alumno.nombre} del grupo.`, "info");
                
                inputBuscarAsignado.value = "";
                renderizarListas(inputBuscarDisponible.value, "");

            } catch (error) {
                console.error("Fallo al desvincular alumno:", error);
                mostrarToast("No se pudo dar de baja en la BD.", "error");
            }
        }
    }

    inputBuscarDisponible.addEventListener("input", (e) => {
        renderizarListas(e.target.value, inputBuscarAsignado.value);
    });

    inputBuscarAsignado.addEventListener("input", (e) => {
        renderizarListas(inputBuscarDisponible.value, e.target.value);
    });

    function mostrarToast(mensaje, tipo = "info") {
        toastMsg.textContent = mensaje;
        toast.className = "toast-container show";
        
        if (tipo === "error") {
            toast.style.backgroundColor = "#fdeaea";
            toastMsg.style.color = "#b03030";
            toastIcon.textContent = "error";
            toastIcon.style.color = "#b03030";
        } else if (tipo === "success") {
            toast.style.backgroundColor = "#e6faf3";
            toastMsg.style.color = "#0a7a52";
            toastIcon.textContent = "check_circle";
            toastIcon.style.color = "#0a7a52";
        } else {
            toast.style.backgroundColor = "#e4f4ff";
            toastMsg.style.color = "#004aa0";
            toastIcon.textContent = "info";
            toastIcon.style.color = "#0062FF";
        }
        setTimeout(() => toast.classList.remove("show"), 3000);
    }
    
    cargarDatosBackend();
});