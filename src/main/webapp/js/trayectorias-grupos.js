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

            mostrarToast(`Consultando datos de ${busqueda} para el periodo ${periodo}`, "success");
            
            renderizarResultadosVacio(); 

        }, 800);
    });
    
    function renderizarResultadosVacio() {
        contenedorResultados.innerHTML = `
            <div class="estado-vacio" style="background: white; border: 1px solid var(--border-light); border-radius: var(--radius-lg); margin-top: 20px;">
                <span class="material-symbols-rounded">construction</span>
                <p>Aquí se mostrarán los resultados y grupos del alumno.</p>
            </div>
        `;
    }
});