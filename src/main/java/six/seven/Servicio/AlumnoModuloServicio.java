package six.seven.Servicio;


import six.seven.Dominio.HorarioAlumno;
import six.seven.Dominio.KardexAlumno;
import six.seven.Dominio.Calificacion;
import six.seven.Repositorio.HorarioAlumnoRepositorio;
import six.seven.Repositorio.KardexAlumnoRepositorio;
import six.seven.Repositorio.CalificacionRepositorio;
import six.seven.Repositorio.AlumnoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AlumnoModuloServicio {

    @Autowired
    private HorarioAlumnoRepositorio horarioRepositorio;

    @Autowired
    private KardexAlumnoRepositorio kardexRepositorio;

    @Autowired
    private CalificacionRepositorio calificacionRepositorio;

    @Autowired
    private AlumnoRepo alumnoRepositorio;

    // ── Horario ─────────────────────────────────────────────────

    // Obtener horario completo del alumno
    public List<HorarioAlumno> obtenerHorario(Integer idAlumno) {
        validarAlumno(idAlumno);
        return horarioRepositorio.findHorarioByAlumno(idAlumno);
    }

    // Obtener horario del alumno filtrado por periodo
    public List<HorarioAlumno> obtenerHorarioPorPeriodo(Integer idAlumno, String periodo) {
        validarAlumno(idAlumno);
        return horarioRepositorio.findHorarioByAlumnoAndPeriodo(idAlumno, periodo);
    }

    // ── Kardex ──────────────────────────────────────────────────

    // Obtener kardex completo (historial de materias y calificaciones)
    public List<KardexAlumno> obtenerKardex(Integer idAlumno) {
        validarAlumno(idAlumno);
        return kardexRepositorio.findKardexByAlumno(idAlumno);
    }

    // Obtener kardex filtrado por periodo
    public List<KardexAlumno> obtenerKardexPorPeriodo(Integer idAlumno, String periodo) {
        validarAlumno(idAlumno);
        return kardexRepositorio.findKardexByAlumnoAndPeriodo(idAlumno, periodo);
    }

    // Obtener solo materias acreditadas
    public List<KardexAlumno> obtenerMateriasAcreditadas(Integer idAlumno) {
        validarAlumno(idAlumno);
        return kardexRepositorio.findMateriasAcreditadas(idAlumno);
    }

    // ── Calificaciones actuales ──────────────────────────────────

    // Obtener calificaciones actuales del alumno
    public List<Calificacion> obtenerCalificacionesActuales(Integer idAlumno) {
        validarAlumno(idAlumno);
        return calificacionRepositorio.findByIdAlumno(idAlumno);
    }

    // ── Validación interna ───────────────────────────────────────
    private void validarAlumno(Integer idAlumno) {
        if (!alumnoRepositorio.existsById(idAlumno))
            throw new RuntimeException("No existe el alumno con ID: " + idAlumno);
    }
}
