document.addEventListener('DOMContentLoaded', () => {
    // 1. Intentamos leer la sesión activa desde el almacenamiento local
    let session = JSON.parse(localStorage.getItem('acadex_session'));

        // Si no hay sesión, creamos una de ejemplo (esto se eliminará cuando haya backend)
    if (!session) {
        session = {
            nombre: "Fabián Salazar",
            rol: "Estudiante de Ingeniería",
            identificador: "20210634",
            correo: "fabian.salazar@mochis.tecnm.mx",
            esAlumno: true
        };
    }

    
    document.getElementById('profileName').textContent = session.nombre;
    document.getElementById('profileRole').textContent = session.rol;
    document.getElementById('profileIdentificador').textContent = session.identificador;
    document.getElementById('profileEmail').textContent = session.correo;

    
    const lblIdentificador = document.getElementById('lblIdentificador');
    if (session.esAlumno) {
        lblIdentificador.textContent = "Número de Control";
    } else {
        lblIdentificador.textContent = "Número de Nómina / Tarjeta";
    }

    
    const iniciales = session.nombre
        .split(' ')
        .map(palabra => palabra.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    
    document.getElementById('profileAvatar').textContent = iniciales;

    // Manejo del Cierre de Sesión (Limpia los datos al salir)
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('acadex_session');
    });
});