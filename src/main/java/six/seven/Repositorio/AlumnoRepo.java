package six.seven.Repositorio;


import six.seven.Dominio.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AlumnoRepo extends JpaRepository<Alumno, Integer> {
    boolean existsByMatricula(String matricula);
    boolean existsByCorreo(String correo);
    Optional<Alumno> findByMatricula(String matricula);
}