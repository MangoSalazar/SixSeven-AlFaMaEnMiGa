// Toggle contraseña
const togglePw = document.getElementById('togglePw');
const pwInput  = document.getElementById('password');
const eyeIcon  = document.getElementById('eyeIcon');

togglePw.addEventListener('click', () => {
  const isHidden = pwInput.type === 'password';
  pwInput.type = isHidden ? 'text' : 'password';
  eyeIcon.textContent = isHidden ? 'visibility_off' : 'visibility';
});

// Submit con animación y ruteo de tres vías (Administración, Docente y Alumno)
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

  // Activar estado de carga institucional
  btn.disabled = true;
  spinner.style.display = 'block';
  icon.style.display = 'none';
  text.textContent = 'Verificando...';

  setTimeout(() => {
    const userUpper = user.toUpperCase();
    let destino = null;

    // 1. CONTROL DE ROLES 
    
    // ROL DOCENTE: Si inicia con DOC
    if (userUpper.startsWith('DOC')) {
      destino = 'views/Docentes/mis-grupos.html';
    } 
    // ROL COORDINADOR: Si es ADMIN o COORD
    else if (userUpper === 'ADMIN' || userUpper === 'COORD') {
      destino = 'views/coordinador/materias.html';
    }
    // ROL ALUMNO: Si ingresa puros números (número_control) o la palabra ALUMNO
    else if (/^\d+$/.test(user) || userUpper === 'ALUMNO') {
      destino = 'views/Alumnos/dashboard.html';
    }

    // 2. DESPLIEGUE DE INTERFAZ CONDICIONAL
    if (!destino) {
      // Credenciales inválidas: restaurar componentes y detonar alerta
      spinner.style.display = 'none';
      icon.style.display = '';
      text.textContent = 'Entrar al sistema';
      btn.disabled = false;

      document.getElementById('alertMsg').textContent = 'Usuario o contraseña incorrectos. Verifica tus datos.';
      alert.classList.add('show');
    } else {
      // Credenciales válidas
      spinner.style.display = 'none';
      icon.style.display = '';
      icon.textContent = 'check_circle';
      btn.style.background = 'var(--mint)';
      text.textContent = '¡Bienvenido!';

      // Pausa estética de 600ms antes de la redirección física
      setTimeout(() => {
        window.location.href = destino;
      }, 600);
    }
  }, 1400);
}

// Enter para enviar formulario
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});