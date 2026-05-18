package six.seven.Controlador;


import six.seven.Servicio.GrupoAlumnoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grupos-alumnos")
public class GrupoAlumnoControlador {

    @Autowired
    private GrupoAlumnoServicio grupoAlumnoServicio
            ;

    // Vincular alumno a grupo
    @PostMapping("/{idGrupo}/alumnos/{idAlumno}")
    public ResponseEntity<?> vincular(@PathVariable Integer idGrupo,
                                      @PathVariable Integer idAlumno) {
        try {
            return ResponseEntity.ok(grupoAlumnoServicio.vincular(idGrupo, idAlumno));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ver alumnos de un grupo
    @GetMapping("/{idGrupo}/alumnos")
    public ResponseEntity<?> alumnosDeGrupo(@PathVariable Integer idGrupo) {
        return ResponseEntity.ok(grupoAlumnoServicio.alumnosDeGrupo(idGrupo));
    }

    // Ver grupos de un alumno
    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<?> gruposDeAlumno(@PathVariable Integer idAlumno) {
        return ResponseEntity.ok(grupoAlumnoServicio.gruposDeAlumno(idAlumno));
    }

    // Desvincular alumno de grupo
    @DeleteMapping("/{idGrupo}/alumnos/{idAlumno}")
    public ResponseEntity<?> desvincular(@PathVariable Integer idGrupo,
                                         @PathVariable Integer idAlumno) {
        try {
            grupoAlumnoServicio.desvincular(idGrupo, idAlumno);
            return ResponseEntity.ok("Alumno desvinculado del grupo correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}