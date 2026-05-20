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
    const idGrupo = urlParams.get('idGrupo') || 'G001';
    const nombreMateria = urlParams.get('materia') || 'Materia Desconocida';

    // Rellenar Encabezado
    headerMateria.textContent = `${idGrupo} - ${nombreMateria}`;
    headerClaveGrupo.textContent = `Grupo ${idGrupo}`;
    headerDocente.textContent = "Ing. Roberto Carlos"; 
    headerPeriodo.textContent = "Ago-Dic 2026";

    // --- Datos Simulados ---
    // Alumnos que cumplen prerrequisitos para la materia
    let alumnosDisponibles = [
        { control: '20210634', nombre: 'Juan García López', carrera: 'ISC' },
        { control: '20210855', nombre: 'María Fernanda Ruiz', carrera: 'ISC' },
        { control: '20210912', nombre: 'Carlos Eduardo Soto', carrera: 'ISC' },
        { control: '20211105', nombre: 'Ana Victoria Cota', carrera: 'ISC' },
        { control: '20211244', nombre: 'Luis Mario Verdugo', carrera: 'ISC' }
    ];

    // Alumnos ya inscritos en este grupo
    let alumnosAsignados = [
        { control: '20210511', nombre: 'Jesús Antonio Beltrán', carrera: 'ISC' },
        { control: '20210589', nombre: 'Diana Laura Félix', carrera: 'ISC' }
    ];

    // --- Funcion para renderizar ambas listas ---
    function renderizarListas(filtroDisp = "", filtroAsig = "") {
        // Filtrar arrays si hay texto en los buscadores
        const dispFiltrados = alumnosDisponibles.filter(a => 
            a.nombre.toLowerCase().includes(filtroDisp.toLowerCase()) || 
            a.control.includes(filtroDisp)
        );
        
        const asigFiltrados = alumnosAsignados.filter(a => 
            a.nombre.toLowerCase().includes(filtroAsig.toLowerCase()) || 
            a.control.includes(filtroAsig)
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

        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = `
            <div style="font-size: 13.5px; font-weight: 600; color: var(--prussian);">${alumno.nombre}</div>
            <div style="font-size: 11.5px; color: var(--text-muted); display: flex; gap: 8px; margin-top: 2px;">
                <span>#${alumno.control}</span>
                <span>• ${alumno.carrera}</span>
            </div>
        `;

        const actionBtn = document.createElement("button");
        if (tipo === 'disponible') {
            actionBtn.className = "btn btn-icon";
            actionBtn.style.color = "var(--sapphire)";
            actionBtn.innerHTML = `<span class="material-symbols-rounded">person_add</span>`;
            actionBtn.title = "Agregar al grupo";
            actionBtn.onclick = () => agregarAlumno(alumno.control);
        } else {
            actionBtn.className = "btn btn-icon";
            actionBtn.style.color = "var(--strawberry)";
            actionBtn.style.borderColor = "var(--strawberry-border)";
            actionBtn.innerHTML = `<span class="material-symbols-rounded">person_remove</span>`;
            actionBtn.title = "Quitar del grupo";
            actionBtn.onclick = () => quitarAlumno(alumno.control);
        }

        div.appendChild(infoDiv);
        div.appendChild(actionBtn);
        return div;
    }

    // --- Logica Alta de Alumno ---
    function agregarAlumno(control) {
        if (alumnosAsignados.length >= CAPACIDAD_MAXIMA) {
            mostrarToast("Capacidad máxima del grupo alcanzada (30/30).", "error");
            return;
        }

        const index = alumnosDisponibles.findIndex(a => a.control === control);
        if (index > -1) {
            const alumno = alumnosDisponibles[index];
            alumnosDisponibles.splice(index, 1);
            alumnosAsignados.push(alumno);
            mostrarToast(`Alumno ${alumno.nombre} inscrito correctamente.`, "success");
            
            inputBuscarDisponible.value = "";
            renderizarListas("", inputBuscarAsignado.value);
        }
    }

    // --- Logica Baja de Alumno ---
    function quitarAlumno(control) {
        const index = alumnosAsignados.findIndex(a => a.control === control);
        if (index > -1) {
            const alumno = alumnosAsignados[index];
            alumnosAsignados.splice(index, 1);
            alumnosDisponibles.push(alumno);

            mostrarToast(`Se dio de baja a ${alumno.nombre} del grupo.`, "info");
            
            inputBuscarAsignado.value = "";
            renderizarListas(inputBuscarDisponible.value, "");
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
    
    renderizarListas();
});