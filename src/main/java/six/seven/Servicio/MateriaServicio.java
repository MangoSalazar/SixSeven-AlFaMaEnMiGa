package six.seven.Servicio;

import six.seven.Dominio.Materia;
import six.seven.Repositorio.MateriaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MateriaServicio {

    @Autowired
    private MateriaRepo materiaRepo;

    public Materia registrar(Materia materia) {
        if (materia.getNombre() == null || materia.getNombre().isBlank())
            throw new RuntimeException("El nombre de la materia es obligatorio.");
        if (materia.getClave() == null || materia.getClave().isBlank())
            throw new RuntimeException("La clave de la materia es obligatoria.");

        if (materiaRepo.existsByClave(materia.getClave()))
            throw new RuntimeException("Ya existe una materia con la clave: " + materia.getClave());

        return materiaRepo.save(materia);
    }

    public List<Materia> obtenerTodos() {
        return materiaRepo.findAll();
    }

    public Optional<Materia> buscarPorId(Integer id) {
        return materiaRepo.findById(id);
    }

    public void eliminar(Integer id) {
        if (!materiaRepo.existsById(id))
            throw new RuntimeException("No existe una materia con el ID: " + id);
        materiaRepo.deleteById(id);
    }
}