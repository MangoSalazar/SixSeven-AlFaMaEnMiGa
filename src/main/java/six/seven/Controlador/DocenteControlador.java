package six.seven.Controlador;


import six.seven.Dominio.Docente;
import six.seven.Servicio.DocenteServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/docentes")
public class DocenteControlador {

    @Autowired
    private DocenteServicio docenteServicio;

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Docente docente) {
        try {
            return ResponseEntity.ok(docenteServicio.registrar(docente));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Docente> obtenerTodos() {
        return docenteServicio.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return docenteServicio.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            docenteServicio.eliminar(id);
            return ResponseEntity.ok("Docente eliminado correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}