package six.seven.Servicio;

import six.seven.Dominio.Grupo;
import six.seven.Repositorio.GrupoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GrupoServicio {

    @Autowired
    private GrupoRepositorio grupoRepositorio;

    // Registrar grupo con validaciones
    public Grupo registrar(Grupo grupo) {
        if (grupo.getNombreGrupo() == null || grupo.getNombreGrupo().isBlank())
            throw new RuntimeException("El nombre del grupo es obligatorio.");
        if (grupo.getIdPeriodo() == null)
            throw new RuntimeException("El periodo es obligatorio.");
        if (grupoRepositorio.existsByNombreGrupoAndIdPeriodo(grupo.getNombreGrupo(), grupo.getIdPeriodo()))
            throw new RuntimeException("Ya existe un grupo con ese nombre en el periodo indicado.");

        return grupoRepositorio.save(grupo);
    }

    public List<Grupo> obtenerTodos() {
        return grupoRepositorio.findAll();
    }

    public Optional<Grupo> buscarPorId(Integer id) {
        return grupoRepositorio.findById(id);
    }

    public List<Grupo> buscarPorPeriodo(Integer idPeriodo) {
        return grupoRepositorio.findByIdPeriodo(idPeriodo);
    }

    public void eliminar(Integer id) {
        if (!grupoRepositorio.existsById(id))
            throw new RuntimeException("No existe un grupo con el ID: " + id);
        grupoRepositorio.deleteById(id);
    }
}