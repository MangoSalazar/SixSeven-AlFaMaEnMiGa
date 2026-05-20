document.addEventListener('DOMContentLoaded', () => {
    // 1. LEER DATOS DE SESIÓN DE MANERA DINÁMICA
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


    
    const payloadDashboard = {
        gpa: 88.5,
        progress: "35%",
        credits: 112,
        clasesHoy: [
            { materia: "Estructura de Datos", hora: "08:00 - 09:00", aula: "Aula L2" },
            { materia: "Programación Web", hora: "12:00 - 13:00", aula: "Laboratorio C" }
        ]
    };

    document.getElementById('kpiGPA').textContent = payloadDashboard.gpa.toFixed(1);
    document.getElementById('kpiProgress').textContent = payloadDashboard.progress;
    document.getElementById('kpiCredits').textContent = payloadDashboard.credits;

    renderizarClasesHoy(payloadDashboard.clasesHoy);

    setTimeout(() => {
        const bar = document.getElementById('barProgress');
        if (bar) bar.style.width = payloadDashboard.progress;
    }, 200);
});

function renderizarClasesHoy(clases) {
    const contenedor = document.getElementById('listaClasesHoy');
    if (!contenedor) return;
    contenedor.innerHTML = "";

    clases.forEach(clase => {
        const div = document.createElement('div');
        div.className = "class-today-item";
        div.innerHTML = `
            <div>
                <p style="margin: 0; font-weight: 700; color: var(--prussian); font-size: 0.95rem;">${clase.materia}</p>
                <p style="margin: 0; font-size: 0.8rem; color: #64748b; display: flex; align-items: center; gap: 4px;">
                    <span class="material-symbols-rounded" style="font-size: 0.9rem;">location_on</span> ${clase.aula}
                </p>
            </div>
            <div style="background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 700;">
                ${clase.hora}
            </div>
        `;
        contenedor.appendChild(div);
    });
}