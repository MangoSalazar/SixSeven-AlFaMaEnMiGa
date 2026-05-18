package six.seven.Repositorio;

import six.seven.Dominio.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GrupoRepositorio extends JpaRepository<Grupo, Integer> {
    List<Grupo> findByIdPeriodo(Integer idPeriodo);
    boolean existsByNombreGrupoAndIdPeriodo(String nombreGrupo, Integer idPeriodo);
}