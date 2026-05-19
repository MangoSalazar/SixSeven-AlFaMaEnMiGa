package six.seven.Repositorio;
import six.seven.Dominio.AsignacionDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AsignacionDocenteRepositorio extends JpaRepository<AsignacionDocente, Integer> {
    List<AsignacionDocente> findByIdDocente(Integer idDocente);
    List<AsignacionDocente> findByIdGrupo(Integer idGrupo);
    boolean existsByIdGrupoAndIdMateria(Integer idGrupo, Integer idMateria);
}