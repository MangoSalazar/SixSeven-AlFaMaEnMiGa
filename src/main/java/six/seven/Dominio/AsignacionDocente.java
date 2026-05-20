package six.seven.Dominio;

import jakarta.persistence.*;
import java.time.LocalTime;

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

    // ── Campos nuevos Día 5 ──────────────────────────
    @Column(name = "dias", nullable = false, length = 50)
    private String dias; // Ej: 'LUN-MIE-VIE'

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(name = "aula", nullable = false, length = 50)
    private String aula;

    public AsignacionDocente() {}

    public Integer getIdAsignacion() { return idAsignacion; }
    public void setIdAsignacion(Integer idAsignacion) { this.idAsignacion = idAsignacion; }

    public Integer getIdGrupo() { return idGrupo; }
    public void setIdGrupo(Integer idGrupo) { this.idGrupo = idGrupo; }

    public Integer getIdMateria() { return idMateria; }
    public void setIdMateria(Integer idMateria) { this.idMateria = idMateria; }

    public Integer getIdDocente() { return idDocente; }
    public void setIdDocente(Integer idDocente) { this.idDocente = idDocente; }

    public String getDias() { return dias; }
    public void setDias(String dias) { this.dias = dias; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public String getAula() { return aula; }
    public void setAula(String aula) { this.aula = aula; }
}