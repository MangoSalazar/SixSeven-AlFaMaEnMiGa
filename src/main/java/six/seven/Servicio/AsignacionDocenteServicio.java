package six.seven.Servicio;


import six.seven.Dominio.AsignacionDocente;
import six.seven.Repositorio.AsignacionDocenteRepositorio;
import six.seven.Repositorio.GrupoRepositorio;
import six.seven.Repositorio.DocenteRepo;
import six.seven.Repositorio.MateriaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AsignacionDocenteServicio {

    @Autowired
    private AsignacionDocenteRepositorio asignacionRepositorio;

    @Autowired
    private GrupoRepositorio grupoRepositorio;

    @Autowired
    private DocenteRepo docenteRepositorio;

    @Autowired
    private MateriaRepo materiaRepositorio;

    // Asignar docente y materia a un grupo
    public AsignacionDocente asignar(AsignacionDocente asignacion) {
        if (asignacion.getIdGrupo() == null)
            throw new RuntimeException("El ID del grupo es obligatorio.");
        if (asignacion.getIdDocente() == null)
            throw new RuntimeException("El ID del docente es obligatorio.");
        if (asignacion.getIdMateria() == null)
            throw new RuntimeException("El ID de la materia es obligatorio.");

        if (!grupoRepositorio.existsById(asignacion.getIdGrupo()))
            throw new RuntimeException("No existe el grupo con ID: " + asignacion.getIdGrupo());
        if (!docenteRepositorio.existsById(asignacion.getIdDocente()))
            throw new RuntimeException("No existe el docente con ID: " + asignacion.getIdDocente());
        if (!materiaRepositorio.existsById(asignacion.getIdMateria()))
            throw new RuntimeException("No existe la materia con ID: " + asignacion.getIdMateria());
        if (asignacionRepositorio.existsByIdGrupoAndIdMateria(asignacion.getIdGrupo(), asignacion.getIdMateria()))
            throw new RuntimeException("Esa materia ya está asignada a ese grupo.");

        return asignacionRepositorio.save(asignacion);
    }

    // Consultar grupos asignados a un docente
    public List<AsignacionDocente> buscarPorDocente(Integer idDocente) {
        if (!docenteRepositorio.existsById(idDocente))
            throw new RuntimeException("No existe el docente con ID: " + idDocente);
        return asignacionRepositorio.findByIdDocente(idDocente);
    }

    // Consultar asignaciones de un grupo
    public List<AsignacionDocente> buscarPorGrupo(Integer idGrupo) {
        return asignacionRepositorio.findByIdGrupo(idGrupo);
    }

    public void eliminar(Integer id) {
        if (!asignacionRepositorio.existsById(id))
            throw new RuntimeException("No existe la asignación con ID: " + id);
        asignacionRepositorio.deleteById(id);
    }
}