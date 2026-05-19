package six.seven.Repositorio;

import six.seven.Dominio.GrupoAlumno;
import six.seven.Dominio.GrupoAlumnoId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GrupoAlumnoRepositorio extends JpaRepository<GrupoAlumno, GrupoAlumnoId> {
    List<GrupoAlumno> findByIdIdGrupo(Integer idGrupo);
    List<GrupoAlumno> findByIdIdAlumno(Integer idAlumno);
}
