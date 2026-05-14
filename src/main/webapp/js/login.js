// Toggle contraseña
const togglePw = document.getElementById('togglePw');
const pwInput  = document.getElementById('password');
const eyeIcon  = document.getElementById('eyeIcon');

togglePw.addEventListener('click', () => {
  const isHidden = pwInput.type === 'password';
  pwInput.type = isHidden ? 'text' : 'password';
  eyeIcon.textContent = isHidden ? 'visibility_off' : 'visibility';
});

// Submit con animación
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

  // Simular carga
  btn.disabled = true;
  spinner.style.display = 'block';
  icon.style.display = 'none';
  text.textContent = 'Verificando...';

  setTimeout(() => {
    spinner.style.display = 'none';
    icon.style.display = '';
    text.textContent = 'Entrar al sistema';
    btn.disabled = false;

    // Demo: mostrar error si no es "admin"
    if (user !== 'admin') {
      document.getElementById('alertMsg').textContent = 'Usuario o contraseña incorrectos. Verifica tus datos.';
      alert.classList.add('show');
    } else {
      icon.textContent = 'check_circle';
      btn.style.background = 'var(--mint)';
      text.textContent = '¡Bienvenido!';
    }
  }, 1400);
}

// Enter para enviar
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});