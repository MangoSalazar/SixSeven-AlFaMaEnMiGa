package six.seven.Repositorio;

import six.seven.Dominio.EvaluacionDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvaluacionDocenteRepositorio extends JpaRepository<EvaluacionDocente, Integer> {
    List<EvaluacionDocente> findByIdDocente(Integer idDocente);
    List<EvaluacionDocente> findByIdAlumno(Integer idAlumno);
    boolean existsByIdAlumnoAndIdDocenteAndIdPeriodo(Integer idAlumno, Integer idDocente, Integer idPeriodo);
}