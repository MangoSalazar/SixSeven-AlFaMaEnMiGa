package six.seven.Dominio;
import jakarta.persistence.*;

@Entity
@Table(name = "GRUPO_ALUMNO")
public class GrupoAlumno {

    @EmbeddedId
    private GrupoAlumnoId id;

    public GrupoAlumno() {}

    public GrupoAlumno(Integer idGrupo, Integer idAlumno) {
        this.id = new GrupoAlumnoId(idGrupo, idAlumno);
    }

    public GrupoAlumnoId getId() { return id; }
    public void setId(GrupoAlumnoId id) { this.id = id; }
}