package six.seven.Repositorio;


import six.seven.Dominio.KardexAlumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface KardexAlumnoRepositorio extends JpaRepository<KardexAlumno, Integer> {

    // Kardex completo de un alumno
    @Query(value = "SELECT * FROM vw_kardex_alumno WHERE id_alumno = :idAlumno", nativeQuery = true)
    List<KardexAlumno> findKardexByAlumno(@Param("idAlumno") Integer idAlumno);

    // Kardex filtrado por periodo
    @Query(value = "SELECT * FROM vw_kardex_alumno WHERE id_alumno = :idAlumno AND periodo = :periodo", nativeQuery = true)
    List<KardexAlumno> findKardexByAlumnoAndPeriodo(@Param("idAlumno") Integer idAlumno,
                                                    @Param("periodo") String periodo);

    // Solo materias acreditadas
    @Query(value = "SELECT * FROM vw_kardex_alumno WHERE id_alumno = :idAlumno AND estatus_materia = 'ACREDITADA'", nativeQuery = true)
    List<KardexAlumno> findMateriasAcreditadas(@Param("idAlumno") Integer idAlumno);
}