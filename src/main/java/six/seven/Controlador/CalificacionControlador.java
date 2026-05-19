package six.seven.Controlador;

import six.seven.Dominio.Calificacion;
import six.seven.Servicio.CalificacionServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/calificaciones")
public class CalificacionControlador {

    @Autowired
    private CalificacionServicio calificacionServicio;

    // Registrar calificaciones de un alumno en una asignación
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Calificacion calificacion) {
        try {
            return ResponseEntity.ok(calificacionServicio.registrar(calificacion));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Actualizar calificaciones existentes
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Calificacion datos) {
        try {
            return ResponseEntity.ok(calificacionServicio.actualizar(id, datos));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ver calificaciones de todos los alumnos de una asignación (grupo + materia)
    @GetMapping("/asignacion/{idAsignacion}")
    public List<Calificacion> porAsignacion(@PathVariable Integer idAsignacion) {
        return calificacionServicio.obtenerPorAsignacion(idAsignacion);
    }

    // Ver todas las calificaciones de un alumno
    @GetMapping("/alumno/{idAlumno}")
    public List<Calificacion> porAlumno(@PathVariable Integer idAlumno) {
        return calificacionServicio.obtenerPorAlumno(idAlumno);
    }

    // Ver calificación específica de un alumno en una asignación
    @GetMapping("/alumno/{idAlumno}/asignacion/{idAsignacion}")
    public ResponseEntity<?> buscar(@PathVariable Integer idAlumno,
                                    @PathVariable Integer idAsignacion) {
        return calificacionServicio.buscarPorAlumnoYAsignacion(idAlumno, idAsignacion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
