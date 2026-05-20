document.addEventListener('DOMContentLoaded', () => {
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


    const payloadKardex = [
        { clave: "MAT-1012", materia: "Cálculo Diferencial", calificacion: 85.0, estatus: "Aprobada" },
        { clave: "INF-1053", materia: "Fundamentos de Programación", calificacion: 92.0, estatus: "Aprobada" }
    ];

    renderizarKardex(payloadKardex);
});

function renderizarKardex(listaKardex) {
    const tbody = document.getElementById('tablaKardex');
    if (!tbody) return;
    tbody.innerHTML = "";

    let sumaCalificaciones = 0;
    const totalMaterias = listaKardex.length;

    listaKardex.forEach(item => {
        const tr = document.createElement('tr');
        const badgeClass = item.estatus === 'Aprobada' ? 'approved' : 'reproved';
        
        sumaCalificaciones += item.calificacion;

        tr.innerHTML = `
            <td class="font-bold text-prussian">${item.clave}</td>
            <td>${item.materia}</td>
            <td style="text-align: center; font-weight: 700; color: var(--prussian);">${item.calificacion.toFixed(1)}</td>
            <td style="text-align: center;">
                <span class="status-badge ${badgeClass}">${item.estatus}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Operación matemática del promedio automático
    if (totalMaterias > 0) {
        const promedioFinal = sumaCalificaciones / totalMaterias;
        document.getElementById('promedioKardex').textContent = promedioFinal.toFixed(1);
        document.getElementById('totalMaterias').textContent = totalMaterias;
    }
}