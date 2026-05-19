package six.seven.Servicio;


import six.seven.Dominio.Docente;
import six.seven.Repositorio.DocenteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DocenteServicio {

    @Autowired
    private DocenteRepo docenteRepo;

    public Docente registrar(Docente docente) {
        if (docente.getRfc() == null || docente.getRfc().isBlank())
            throw new RuntimeException("El RFC es obligatorio.");
        if (docente.getNombre() == null || docente.getNombre().isBlank())
            throw new RuntimeException("El nombre es obligatorio.");
        if (docente.getCorreo() == null || docente.getCorreo().isBlank())
            throw new RuntimeException("El correo es obligatorio.");
        if (docente.getUsername() == null || docente.getUsername().isBlank())
            throw new RuntimeException("El username es obligatorio.");

        if (docenteRepo.existsByRfc(docente.getRfc()))
            throw new RuntimeException("Ya existe un docente con el RFC: " + docente.getRfc());
        if (docenteRepo.existsByCorreo(docente.getCorreo()))
            throw new RuntimeException("Ya existe un docente con el correo: " + docente.getCorreo());

        return docenteRepo.save(docente);
    }

    public List<Docente> obtenerTodos() {
        return docenteRepo.findAll();
    }

    public Optional<Docente> buscarPorId(Integer id) {
        return docenteRepo.findById(id);
    }

    public void eliminar(Integer id) {
        if (!docenteRepo.existsById(id))
            throw new RuntimeException("No existe un docente con el ID: " + id);
        docenteRepo.deleteById(id);
    }
}