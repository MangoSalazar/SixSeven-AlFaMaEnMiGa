package six.seven.Repositorio;

import six.seven.Dominio.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CalificacionRepositorio extends JpaRepository<Calificacion, Integer> {
    List<Calificacion> findByIdAsignacion(Integer idAsignacion);
    List<Calificacion> findByIdAlumno(Integer idAlumno);
    Optional<Calificacion> findByIdAlumnoAndIdAsignacion(Integer idAlumno, Integer idAsignacion);
    boolean existsByIdAlumnoAndIdAsignacion(Integer idAlumno, Integer idAsignacion);
}