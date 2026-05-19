package six.seven.Servicio;

import six.seven.Dominio.Calificacion;
import six.seven.Repositorio.CalificacionRepositorio;
import six.seven.Repositorio.AlumnoRepo;
import six.seven.Repositorio.AsignacionDocenteRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CalificacionServicio {

    @Autowired
    private CalificacionRepositorio calificacionRepositorio;

    @Autowired
    private AlumnoRepo alumnoRepositorio;

    @Autowired
    private AsignacionDocenteRepositorio asignacionRepositorio;

    // Registrar calificaciones (parciales + cálculo automático de promedio)
    public Calificacion registrar(Calificacion calificacion) {
        if (calificacion.getIdAlumno() == null)
            throw new RuntimeException("El ID del alumno es obligatorio.");
        if (calificacion.getIdAsignacion() == null)
            throw new RuntimeException("El ID de la asignación es obligatorio.");

        if (!alumnoRepositorio.existsById(calificacion.getIdAlumno()))
            throw new RuntimeException("No existe el alumno con ID: " + calificacion.getIdAlumno());
        if (!asignacionRepositorio.existsById(calificacion.getIdAsignacion()))
            throw new RuntimeException("No existe la asignación con ID: " + calificacion.getIdAsignacion());
        if (calificacionRepositorio.existsByIdAlumnoAndIdAsignacion(
                calificacion.getIdAlumno(), calificacion.getIdAsignacion()))
            throw new RuntimeException("Ya existe una calificación para este alumno en esa asignación.");

        // Validar rango de calificaciones (0 - 100)
        validarRango(calificacion.getParcial1(), "Parcial 1");
        validarRango(calificacion.getParcial2(), "Parcial 2");
        validarRango(calificacion.getParcial3(), "Parcial 3");

        // Calcular promedio en Java (el trigger de BD también lo hace)
        BigDecimal promedio = calificacion.getParcial1()
                .add(calificacion.getParcial2())
                .add(calificacion.getParcial3())
                .divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
        calificacion.setNotaFinal(promedio);
        calificacion.setFechaRegistro(LocalDateTime.now());

        return calificacionRepositorio.save(calificacion);
    }

    // Actualizar calificaciones existentes
    public Calificacion actualizar(Integer id, Calificacion datos) {
        Calificacion existente = calificacionRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe la calificación con ID: " + id));

        if (datos.getParcial1() != null) {
            validarRango(datos.getParcial1(), "Parcial 1");
            existente.setParcial1(datos.getParcial1());
        }
        if (datos.getParcial2() != null) {
            validarRango(datos.getParcial2(), "Parcial 2");
            existente.setParcial2(datos.getParcial2());
        }
        if (datos.getParcial3() != null) {
            validarRango(datos.getParcial3(), "Parcial 3");
            existente.setParcial3(datos.getParcial3());
        }
        if (datos.getObservaciones() != null)
            existente.setObservaciones(datos.getObservaciones());

        // Recalcular promedio
        BigDecimal promedio = existente.getParcial1()
                .add(existente.getParcial2())
                .add(existente.getParcial3())
                .divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
        existente.setNotaFinal(promedio);

        return calificacionRepositorio.save(existente);
    }

    // Obtener calificaciones de todos los alumnos de una asignación
    public List<Calificacion> obtenerPorAsignacion(Integer idAsignacion) {
        return calificacionRepositorio.findByIdAsignacion(idAsignacion);
    }

    // Obtener calificaciones de un alumno
    public List<Calificacion> obtenerPorAlumno(Integer idAlumno) {
        return calificacionRepositorio.findByIdAlumno(idAlumno);
    }

    // Buscar calificación específica alumno + asignación
    public Optional<Calificacion> buscarPorAlumnoYAsignacion(Integer idAlumno, Integer idAsignacion) {
        return calificacionRepositorio.findByIdAlumnoAndIdAsignacion(idAlumno, idAsignacion);
    }

    private void validarRango(BigDecimal valor, String campo) {
        if (valor == null) return;
        if (valor.compareTo(BigDecimal.ZERO) < 0 || valor.compareTo(BigDecimal.valueOf(100)) > 0)
            throw new RuntimeException(campo + " debe estar entre 0 y 100.");
    }
}
