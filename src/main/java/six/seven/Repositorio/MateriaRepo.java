package six.seven.Repositorio;

import org.springframework.stereotype.Component;


import six.seven.Dominio.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MateriaRepo extends JpaRepository<Materia, Integer> {
    boolean existsByClave(String clave);
    Optional<Materia> findByClave(String clave);
}