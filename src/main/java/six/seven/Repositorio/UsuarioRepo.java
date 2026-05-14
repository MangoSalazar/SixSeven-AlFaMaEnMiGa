package six.seven.Repositorio;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import six.seven.Dominio.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioRepo extends JpaRepository<Usuario, Long> {

    // Buscar usuario por matrícula
    Optional<Usuario> findByMatricula(String matricula);

    // Verificar si ya existe una matrícula
    boolean existsByMatricula(String matricula);
}