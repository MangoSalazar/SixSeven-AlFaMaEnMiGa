package six.seven.Controlador;


import six.seven.Dominio.Alumno;
import six.seven.Servicio.AlumnoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnoControlador {

    @Autowired
    private AlumnoServicio alumnoServicio;

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Alumno alumno) {
        try {
            return ResponseEntity.ok(alumnoServicio.registrar(alumno));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Alumno> obtenerTodos() {
        return alumnoServicio.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return alumnoServicio.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            alumnoServicio.eliminar(id);
            return ResponseEntity.ok("Alumno eliminado correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}