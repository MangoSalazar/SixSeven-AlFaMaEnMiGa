package six.seven.Controlador;


import six.seven.Dominio.EvaluacionDocente;
import six.seven.Servicio.EvaluacionDocenteServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones-docente")
public class EvaluacionDocenteControlador {

    @Autowired
    private EvaluacionDocenteServicio evaluacionServicio;

    // Registrar evaluación de un docente por un alumno
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody EvaluacionDocente evaluacion) {
        try {
            return ResponseEntity.ok(evaluacionServicio.registrar(evaluacion));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ver evaluaciones recibidas por un docente
    @GetMapping("/docente/{idDocente}")
    public List<EvaluacionDocente> porDocente(@PathVariable Integer idDocente) {
        return evaluacionServicio.obtenerPorDocente(idDocente);
    }

    // Ver evaluaciones realizadas por un alumno
    @GetMapping("/alumno/{idAlumno}")
    public List<EvaluacionDocente> porAlumno(@PathVariable Integer idAlumno) {
        return evaluacionServicio.obtenerPorAlumno(idAlumno);
    }
}
