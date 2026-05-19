// Toggle contraseña
const togglePw = document.getElementById('togglePw');
const pwInput  = document.getElementById('password');
const eyeIcon  = document.getElementById('eyeIcon');

togglePw.addEventListener('click', () => {
  const isHidden = pwInput.type === 'password';
  pwInput.type = isHidden ? 'text' : 'password';
  eyeIcon.textContent = isHidden ? 'visibility_off' : 'visibility';
});

// Submit con animación y control de accesos 
function handleLogin() {
  const user = document.getElementById('usuario').value.trim();
  const pass = document.getElementById('password').value;
  const btn  = document.getElementById('btnLogin');
  const spinner = document.getElementById('spinner');
  const icon    = document.getElementById('loginIcon');
  const text    = document.getElementById('btnText');
  const alert   = document.getElementById('alertLogin');

  alert.classList.remove('show');

  if (!user || !pass) {
    document.getElementById('alertMsg').textContent = 'Por favor completa todos los campos.';
    alert.classList.add('show');
    return;
  }

  // Simular carga e interactividad
  btn.disabled = true;
  spinner.style.display = 'block';
  icon.style.display = 'none';
  text.textContent = 'Verificando...';

  setTimeout(() => {
    const userUpper = user.toUpperCase();
    let destino = null;

    // 1. EVALUACIÓN DE ROLES 
    // Si inicia con DOC, apunta al perfil de la tabla DOCENTE
    if (userUpper.startsWith('DOC')) {
      destino = 'views/Docentes/mis-grupos.html';
    } 
    // Si es ADMIN o COORD, apunta a las credenciales de la tabla COORDINADOR
    else if (userUpper === 'ADMIN' || userUpper === 'COORD') {
      destino = 'views/coordinador/materias.html';
    }

    // 2. CONTROL DE FLUJO DE LA INTERFAZ
    if (!destino) {
      // Si las credenciales no pertenecen a ningún rol, restaurar botón y mostrar error
      spinner.style.display = 'none';
      icon.style.display = '';
      text.textContent = 'Entrar al sistema';
      btn.disabled = false;

      document.getElementById('alertMsg').textContent = 'Usuario o contraseña incorrectos. Verifica tus datos.';
      alert.classList.add('show');
    } else {
      spinner.style.display = 'none';
      icon.style.display = '';
      icon.textContent = 'check_circle';
      btn.style.background = 'var(--mint)';
      text.textContent = '¡Bienvenido!';

      // Retraso de 600ms parea el mensaje de bienvenido
      setTimeout(() => {
        window.location.href = destino;
      }, 600);
    }
  }, 1400);
}

// Enter para enviar
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});