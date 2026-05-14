package six.seven.Servicio;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import six.seven.Dominio.Usuario;
import six.seven.Repositorio.UsuarioRepo;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepo usuarioRepo;

    // Registrar nuevo usuario
    public Usuario registrar(Usuario usuario) {
        if (usuarioRepo.existsByMatricula(usuario.getMatricula())) {
            throw new RuntimeException("Ya existe un usuario con esa matrícula: " + usuario.getMatricula());
        }
        return usuarioRepo.save(usuario);
    }

    // Obtener todos los usuarios
    public List<Usuario> obtenerTodos() {
        return usuarioRepo.findAll();
    }

    // Buscar por ID
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepo.findById(id);
    }

    // Buscar por matrícula
    public Optional<Usuario> buscarPorMatricula(String matricula) {
        return usuarioRepo.findByMatricula(matricula);
    }

    // Eliminar usuario
    public void eliminar(Long id) {
        usuarioRepo.deleteById(id);
    }
}