package six.seven.Controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import six.seven.Dominio.Usuario;
import six.seven.Servicio.UsuarioServicio;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UsuarioControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    // ✔ Verificación: el servidor está activo
    @GetMapping("/ping")
    public String ping() {
        return "✔ El servidor está activo y funcionando correctamente.";
    }

    // Registrar nuevo usuario
    @PostMapping("/usuarios")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevo = usuarioServicio.registrar(usuario);
            return ResponseEntity.ok(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener todos los usuarios
    @GetMapping("/usuarios")
    public List<Usuario> obtenerTodos() {
        return usuarioServicio.obtenerTodos();
    }

    // Buscar usuario por ID
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return usuarioServicio.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar usuario
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        usuarioServicio.eliminar(id);
        return ResponseEntity.ok("Usuario eliminado correctamente.");
    }
}