package six.seven.Controlador;

import six.seven.Dominio.Grupo;
import six.seven.Servicio.GrupoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/grupos")
public class GrupoControlador {

    @Autowired
    private GrupoServicio grupoServicio;

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Grupo grupo) {
        try {
            return ResponseEntity.ok(grupoServicio.registrar(grupo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Grupo> obtenerTodos() {
        return grupoServicio.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return grupoServicio.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/periodo/{idPeriodo}")
    public List<Grupo> buscarPorPeriodo(@PathVariable Integer idPeriodo) {
        return grupoServicio.buscarPorPeriodo(idPeriodo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            grupoServicio.eliminar(id);
            return ResponseEntity.ok("Grupo eliminado correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}