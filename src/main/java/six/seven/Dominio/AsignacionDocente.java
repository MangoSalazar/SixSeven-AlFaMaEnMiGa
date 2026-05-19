package six.seven.Dominio;


import jakarta.persistence.*;

@Entity
@Table(name = "ASIGNACION_DOCENTE")
public class AsignacionDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asignacion")
    private Integer idAsignacion;

    @Column(name = "id_grupo", nullable = false)
    private Integer idGrupo;

    @Column(name = "id_materia", nullable = false)
    private Integer idMateria;

    @Column(name = "id_docente", nullable = false)
    private Integer idDocente;

    public AsignacionDocente() {}

    public Integer getIdAsignacion() { return idAsignacion; }
    public void setIdAsignacion(Integer idAsignacion) { this.idAsignacion = idAsignacion; }

    public Integer getIdGrupo() { return idGrupo; }
    public void setIdGrupo(Integer idGrupo) { this.idGrupo = idGrupo; }

    public Integer getIdMateria() { return idMateria; }
    public void setIdMateria(Integer idMateria) { this.idMateria = idMateria; }

    public Integer getIdDocente() { return idDocente; }
    public void setIdDocente(Integer idDocente) { this.idDocente = idDocente; }
}