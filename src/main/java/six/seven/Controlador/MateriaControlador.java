package six.seven.Controlador;

import six.seven.Dominio.Materia;
import six.seven.Servicio.MateriaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/materias")
public class MateriaControlador {

    @Autowired
    private MateriaServicio materiaServicio;

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Materia materia) {
        try {
            return ResponseEntity.ok(materiaServicio.registrar(materia));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Materia> obtenerTodos() {
        return materiaServicio.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return materiaServicio.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            materiaServicio.eliminar(id);
            return ResponseEntity.ok("Materia eliminada correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}