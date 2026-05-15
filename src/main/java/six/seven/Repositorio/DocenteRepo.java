package six.seven.Repositorio;

import org.springframework.stereotype.Component;

import six.seven.Dominio.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DocenteRepo extends JpaRepository<Docente, Integer> {
    boolean existsByRfc(String rfc);
    boolean existsByCorreo(String correo);
    Optional<Docente> findByRfc(String rfc);
}