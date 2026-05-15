package six.seven.Servicio;

import six.seven.Dominio.Alumno;
import six.seven.Repositorio.AlumnoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AlumnoServicio {

    @Autowired
    private AlumnoRepo alumnoRepo;

    public Alumno registrar(Alumno alumno) {
        // Validación de campos obligatorios
        if (alumno.getMatricula() == null || alumno.getMatricula().isBlank())
            throw new RuntimeException("La matrícula es obligatoria.");
        if (alumno.getNombre() == null || alumno.getNombre().isBlank())
            throw new RuntimeException("El nombre es obligatorio.");
        if (alumno.getCorreo() == null || alumno.getCorreo().isBlank())
            throw new RuntimeException("El correo es obligatorio.");
        if (alumno.getUsername() == null || alumno.getUsername().isBlank())
            throw new RuntimeException("El username es obligatorio.");

        // Validación de duplicados
        if (alumnoRepo.existsByMatricula(alumno.getMatricula()))
            throw new RuntimeException("Ya existe un alumno con la matrícula: " + alumno.getMatricula());
        if (alumnoRepo.existsByCorreo(alumno.getCorreo()))
            throw new RuntimeException("Ya existe un alumno con el correo: " + alumno.getCorreo());

        return alumnoRepo.save(alumno);
    }

    public List<Alumno> obtenerTodos() {
        return alumnoRepo.findAll();
    }

    public Optional<Alumno> buscarPorId(Integer id) {
        return alumnoRepo.findById(id);
    }

    public void eliminar(Integer id) {
        if (!alumnoRepo.existsById(id))
            throw new RuntimeException("No existe un alumno con el ID: " + id);
        alumnoRepo.deleteById(id);
    }
}
 