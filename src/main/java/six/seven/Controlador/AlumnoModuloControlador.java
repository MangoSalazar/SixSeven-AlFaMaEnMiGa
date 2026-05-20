package six.seven.Controlador;

import six.seven.Dominio.HorarioAlumno;
import six.seven.Servicio.AlumnoModuloServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alumno")
public class AlumnoModuloControlador {

    @Autowired
    private AlumnoModuloServicio alumnoModuloServicio;

    // ── Horario ─────────────────────────────────────────────────

    // Obtener horario completo del alumno
    @GetMapping("/{idAlumno}/horario")
    public ResponseEntity<?> obtenerHorario(@PathVariable Integer idAlumno) {
        try {
            List<HorarioAlumno> horario = alumnoModuloServicio.obtenerHorario(idAlumno);
            return ResponseEntity.ok(horario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener horario por periodo
    @GetMapping("/{idAlumno}/horario/periodo/{periodo}")
    public ResponseEntity<?> obtenerHorarioPorPeriodo(@PathVariable Integer idAlumno,
                                                      @PathVariable String periodo) {
        try {
            return ResponseEntity.ok(alumnoModuloServicio.obtenerHorarioPorPeriodo(idAlumno, periodo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Kardex ──────────────────────────────────────────────────

    // Obtener kardex completo
    @GetMapping("/{idAlumno}/kardex")
    public ResponseEntity<?> obtenerKardex(@PathVariable Integer idAlumno) {
        try {
            return ResponseEntity.ok(alumnoModuloServicio.obtenerKardex(idAlumno));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener kardex por periodo
    @GetMapping("/{idAlumno}/kardex/periodo/{periodo}")
    public ResponseEntity<?> obtenerKardexPorPeriodo(@PathVariable Integer idAlumno,
                                                     @PathVariable String periodo) {
        try {
            return ResponseEntity.ok(alumnoModuloServicio.obtenerKardexPorPeriodo(idAlumno, periodo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener solo materias acreditadas
    @GetMapping("/{idAlumno}/kardex/acreditadas")
    public ResponseEntity<?> obtenerAcreditadas(@PathVariable Integer idAlumno) {
        try {
            return ResponseEntity.ok(alumnoModuloServicio.obtenerMateriasAcreditadas(idAlumno));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Calificaciones actuales ──────────────────────────────────

    // Obtener calificaciones actuales del alumno
    @GetMapping("/{idAlumno}/calificaciones")
    public ResponseEntity<?> obtenerCalificaciones(@PathVariable Integer idAlumno) {
        try {
            return ResponseEntity.ok(alumnoModuloServicio.obtenerCalificacionesActuales(idAlumno));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}