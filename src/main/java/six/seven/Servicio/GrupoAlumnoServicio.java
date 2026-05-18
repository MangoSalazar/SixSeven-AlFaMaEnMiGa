package six.seven.Servicio;

import six.seven.Dominio.GrupoAlumno;
import six.seven.Dominio.GrupoAlumnoId;
import six.seven.Repositorio.AlumnoRepo;
import six.seven.Repositorio.GrupoAlumnoRepositorio;
import six.seven.Repositorio.GrupoRepositorio;
import six.seven.Repositorio.GrupoAlumnoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GrupoAlumnoServicio {

    @Autowired
    private GrupoAlumnoRepositorio grupoAlumnoRepositorio;

    @Autowired
    private GrupoRepositorio grupoRepositorio;

    @Autowired
    private AlumnoRepo alumnoRepositorio;

    // Vincular alumno a un grupo
    public GrupoAlumno vincular(Integer idGrupo, Integer idAlumno) {
        if (!grupoRepositorio.existsById(idGrupo))
            throw new RuntimeException("No existe el grupo con ID: " + idGrupo);
        if (!alumnoRepositorio.existsById(idAlumno))
            throw new RuntimeException("No existe el alumno con ID: " + idAlumno);

        GrupoAlumnoId clave = new GrupoAlumnoId(idGrupo, idAlumno);
        if (grupoAlumnoRepositorio.existsById(clave))
            throw new RuntimeException("El alumno ya está vinculado a ese grupo.");

        return grupoAlumnoRepositorio.save(new GrupoAlumno(idGrupo, idAlumno));
    }

    // Consultar alumnos de un grupo
    public List<GrupoAlumno> alumnosDeGrupo(Integer idGrupo) {
        return grupoAlumnoRepositorio.findByIdIdGrupo(idGrupo);
    }

    // Consultar grupos de un alumno
    public List<GrupoAlumno> gruposDeAlumno(Integer idAlumno) {
        return grupoAlumnoRepositorio.findByIdIdAlumno(idAlumno);
    }

    // Desvincular alumno de grupo
    public void desvincular(Integer idGrupo, Integer idAlumno) {
        GrupoAlumnoId clave = new GrupoAlumnoId(idGrupo, idAlumno);
        if (!grupoAlumnoRepositorio.existsById(clave))
            throw new RuntimeException("El alumno no está vinculado a ese grupo.");
        grupoAlumnoRepositorio.deleteById(clave);
    }
}