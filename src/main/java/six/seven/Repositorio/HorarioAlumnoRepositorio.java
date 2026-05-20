package six.seven.Repositorio;

import six.seven.Dominio.HorarioAlumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface HorarioAlumnoRepositorio extends JpaRepository<HorarioAlumno, Integer> {

    // Horario completo de un alumno por su ID
    @Query(value = "SELECT * FROM vw_horario_alumno WHERE id_alumno = :idAlumno", nativeQuery = true)
    List<HorarioAlumno> findHorarioByAlumno(@Param("idAlumno") Integer idAlumno);

    // Horario de un alumno filtrado por periodo
    @Query(value = "SELECT * FROM vw_horario_alumno WHERE id_alumno = :idAlumno AND periodo = :periodo", nativeQuery = true)
    List<HorarioAlumno> findHorarioByAlumnoAndPeriodo(@Param("idAlumno") Integer idAlumno,
                                                      @Param("periodo") String periodo);
}