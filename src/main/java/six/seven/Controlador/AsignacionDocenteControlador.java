package six.seven.Controlador;

import six.seven.Dominio.AsignacionDocente;
import six.seven.Servicio.AsignacionDocenteServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/asignaciones")
public class AsignacionDocenteControlador {

    @Autowired
    private AsignacionDocenteServicio asignacionServicio;

    // Asignar docente + materia a un grupo
    @PostMapping
    public ResponseEntity<?> asignar(@RequestBody AsignacionDocente asignacion) {
        try {
            return ResponseEntity.ok(asignacionServicio.asignar(asignacion));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Consultar grupos de un docente
    @GetMapping("/docente/{idDocente}")
    public ResponseEntity<?> gruposDeDocente(@PathVariable Integer idDocente) {
        try {
            return ResponseEntity.ok(asignacionServicio.buscarPorDocente(idDocente));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Consultar asignaciones de un grupo
    @GetMapping("/grupo/{idGrupo}")
    public List<AsignacionDocente> asignacionesDeGrupo(@PathVariable Integer idGrupo) {
        return asignacionServicio.buscarPorGrupo(idGrupo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            asignacionServicio.eliminar(id);
            return ResponseEntity.ok("Asignación eliminada correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}