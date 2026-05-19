package six.seven.Servicio;

import six.seven.Dominio.EvaluacionDocente;
import six.seven.Repositorio.EvaluacionDocenteRepositorio;
import six.seven.Repositorio.AlumnoRepo;
import six.seven.Repositorio.DocenteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EvaluacionDocenteServicio {

    @Autowired
    private EvaluacionDocenteRepositorio evaluacionRepositorio;

    @Autowired
    private AlumnoRepo alumnoRepositorio;

    @Autowired
    private DocenteRepo docenteRepositorio;

    public EvaluacionDocente registrar(EvaluacionDocente evaluacion) {
        if (evaluacion.getIdAlumno() == null || evaluacion.getIdDocente() == null || evaluacion.getIdPeriodo() == null)
            throw new RuntimeException("Alumno, docente y periodo son obligatorios.");
        if (evaluacion.getPuntajeTotal() == null || evaluacion.getPuntajeTotal() < 0 || evaluacion.getPuntajeTotal() > 100)
            throw new RuntimeException("El puntaje debe estar entre 0 y 100.");

        if (!alumnoRepositorio.existsById(evaluacion.getIdAlumno()))
            throw new RuntimeException("No existe el alumno con ID: " + evaluacion.getIdAlumno());
        if (!docenteRepositorio.existsById(evaluacion.getIdDocente()))
            throw new RuntimeException("No existe el docente con ID: " + evaluacion.getIdDocente());
        if (evaluacionRepositorio.existsByIdAlumnoAndIdDocenteAndIdPeriodo(
                evaluacion.getIdAlumno(), evaluacion.getIdDocente(), evaluacion.getIdPeriodo()))
            throw new RuntimeException("Este alumno ya evaluó a este docente en el periodo indicado.");

        evaluacion.setFechaRealizada(LocalDateTime.now());
        return evaluacionRepositorio.save(evaluacion);
    }

    public List<EvaluacionDocente> obtenerPorDocente(Integer idDocente) {
        return evaluacionRepositorio.findByIdDocente(idDocente);
    }

    public List<EvaluacionDocente> obtenerPorAlumno(Integer idAlumno) {
        return evaluacionRepositorio.findByIdAlumno(idAlumno);
    }
}
