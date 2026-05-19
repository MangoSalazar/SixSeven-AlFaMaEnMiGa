package six.seven.Dominio;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class GrupoAlumnoId implements Serializable {

    private Integer idGrupo;
    private Integer idAlumno;

    public GrupoAlumnoId() {}

    public GrupoAlumnoId(Integer idGrupo, Integer idAlumno) {
        this.idGrupo = idGrupo;
        this.idAlumno = idAlumno;
    }

    public Integer getIdGrupo() { return idGrupo; }
    public void setIdGrupo(Integer idGrupo) { this.idGrupo = idGrupo; }

    public Integer getIdAlumno() { return idAlumno; }
    public void setIdAlumno(Integer idAlumno) { this.idAlumno = idAlumno; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GrupoAlumnoId)) return false;
        GrupoAlumnoId that = (GrupoAlumnoId) o;
        return Objects.equals(idGrupo, that.idGrupo) && Objects.equals(idAlumno, that.idAlumno);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idGrupo, idAlumno);
    }
}