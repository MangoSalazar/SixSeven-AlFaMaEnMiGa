document.addEventListener("DOMContentLoaded", () => {
    // --- Referencias ---
    const inputBusqueda = document.getElementById("campo-busqueda-alumno");
    const selectPeriodo = document.getElementById("filtro-periodo-trayectoria");
    const btnConsultar = document.getElementById("btnConsultarTrayectoria");
    const spinner = document.getElementById("spinnerConsultar");
    const iconoConsultar = document.getElementById("iconoConsultar");
    const contenedorResultados = document.getElementById("resultados-trayectoria-container");

    // --- Referencias Toast ---
    const toast = document.getElementById("toast");
    const toastIcon = document.getElementById("toastIcon");
    const toastMsg = document.getElementById("toastMsg");

    // --- Funcion para mostrar notificaciones Toast ---
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

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // --- Click en Consultar Trayectoria ---
    btnConsultar.addEventListener("click", () => {
        const busqueda = inputBusqueda.value.trim();
        const periodo = selectPeriodo.value;

        // Validaciones iniciales
        if (busqueda === "") {
            mostrarToast("Ingresa el nombre o número de control del alumno.", "error");
            inputBusqueda.parentElement.style.borderColor = "var(--strawberry)";
            return;
        } else {
            inputBusqueda.parentElement.style.borderColor = "";
        }

        if (!periodo) {
            mostrarToast("Selecciona un periodo a consultar.", "error");
            selectPeriodo.parentElement.style.borderColor = "var(--strawberry)";
            return;
        } else {
            selectPeriodo.parentElement.style.borderColor = "";
        }

        btnConsultar.disabled = true;
        iconoConsultar.style.display = "none";
        spinner.style.display = "inline-block";

        // Simulacion de petición al Backend
        setTimeout(() => {
            btnConsultar.disabled = false;
            iconoConsultar.style.display = "inline-block";
            spinner.style.display = "none";

            mostrarToast(`Trayectoria obtenida correctamente`, "success");
            
            // Renderizar los resultados (Puntos 6 y 7)
            renderizarResultados(busqueda, periodo); 

        }, 800);
    });

    function renderizarResultados(alumnoNombre, periodo) {
        // Aquí se procesaría la respuesta del backend para mostrar datos reales.
        contenedorResultados.innerHTML = `
            <div class="resultados-card" style="margin-top: 24px; animation: fadeIn 0.4s ease;">
                
                <div class="resultados-header" style="border-bottom: 1px solid var(--border-light); padding-bottom: 16px; margin-bottom: 20px;">
                    <h2>Resumen del Alumno</h2>
                    <span class="badge badge-sky">Periodo: ${periodo}</span>
                </div>

                <div class="grid-4 mb-24">
                    <div class="metric-card sky">
                        <span class="metric-label">Alumno</span>
                        <div style="font-size: 15px; font-weight: 700; color: var(--prussian); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${alumnoNombre.toUpperCase()}
                        </div>
                        <span class="metric-sub">Ing. en Sistemas Computacionales</span>
                    </div>
                    <div class="metric-card mint">
                        <span class="metric-label">Materias Inscritas</span>
                        <div class="metric-value">6</div>
                        <span class="metric-sub">Créditos totales: 32</span>
                    </div>
                    <div class="metric-card golden">
                        <span class="metric-label">Promedio Semestre</span>
                        <div class="metric-value">N/A</div>
                        <span class="metric-sub">En curso</span>
                    </div>
                    <div class="metric-card sky">
                        <span class="metric-label">Estatus Académico</span>
                        <div style="font-size: 18px; font-weight: 700; color: var(--mint); margin-top: 8px; font-family: 'DM Mono', monospace;">
                            VIGENTE
                        </div>
                    </div>
                </div>

                <div class="resultados-header" style="border-bottom: 1px solid var(--border-light); padding-bottom: 16px; margin-bottom: 20px; margin-top: 32px;">
                    <h2>Grupos Actuales (${periodo})</h2>
                </div>

                <div class="grid-2">
                    ${generarTarjetaGrupo('SCD-1015', 'Programación Web', 'ISC-5A', 'Ing. Roberto Carlos', 'G001')}
                    ${generarTarjetaGrupo('SCD-1016', 'Arquitectura de Software', 'ISC-5A', 'M.C. María Elena', 'G002')}
                    ${generarTarjetaGrupo('SCD-1017', 'Taller de Base de Datos', 'ISC-5B', 'Ing. Luis Fernando', 'G003')}
                    ${generarTarjetaGrupo('SCD-1018', 'Fundamentos de Telecomunicaciones', 'ISC-5A', 'Ing. Arturo Vidal', 'G004')}
                </div>
            </div>
        `;
    }

    // Generar tarjeta individual de grupo con botón de administración ---
    function generarTarjetaGrupo(clave, materia, grupo, docente, idGrupo) {
        return `
            <div class="card" style="position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--sapphire);"></div>
                
                <div style="padding-left: 8px;">
                    <div class="flex-between mb-8">
                        <span class="badge badge-prussian">${clave}</span>
                        <span class="badge badge-golden">${grupo}</span>
                    </div>
                    <h3 style="font-size: 16px; margin-bottom: 6px; color: var(--prussian);">${materia}</h3>
                    <p class="text-sm text-secondary mb-16 flex-center" style="gap: 6px;">
                        <span class="material-symbols-rounded" style="font-size: 16px;">person</span> 
                        Docente: ${docente}
                    </p>
                </div>

                <div style="border-top: 1px solid var(--border-light); padding-top: 16px; margin-top: auto; padding-left: 8px;">
                    <a href="asignacion-alumnos.html?idGrupo=${idGrupo}&materia=${encodeURIComponent(materia)}" class="btn btn-secondary btn-block">
                        <span class="material-symbols-rounded" style="font-size: 18px;">manage_accounts</span>
                        Administrar alumnos del grupo
                    </a>
                </div>
            </div>
        `;
    }
});