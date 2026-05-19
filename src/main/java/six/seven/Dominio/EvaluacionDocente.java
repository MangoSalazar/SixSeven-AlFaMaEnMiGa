package six.seven.Dominio;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "EVALUACION_DOCENTE")
public class EvaluacionDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion_doc")
    private Integer idEvaluacionDoc;

    @Column(name = "id_alumno", nullable = false)
    private Integer idAlumno;

    @Column(name = "id_docente", nullable = false)
    private Integer idDocente;

    @Column(name = "id_periodo", nullable = false)
    private Integer idPeriodo;

    @Column(name = "puntaje_total", nullable = false)
    private Integer puntajeTotal;

    @Column(name = "comentarios", columnDefinition = "TEXT")
    private String comentarios;

    @Column(name = "fecha_realizada")
    private LocalDateTime fechaRealizada;

    public EvaluacionDocente() {}

    public Integer getIdEvaluacionDoc() { return idEvaluacionDoc; }
    public void setIdEvaluacionDoc(Integer idEvaluacionDoc) { this.idEvaluacionDoc = idEvaluacionDoc; }

    public Integer getIdAlumno() { return idAlumno; }
    public void setIdAlumno(Integer idAlumno) { this.idAlumno = idAlumno; }

    public Integer getIdDocente() { return idDocente; }
    public void setIdDocente(Integer idDocente) { this.idDocente = idDocente; }

    public Integer getIdPeriodo() { return idPeriodo; }
    public void setIdPeriodo(Integer idPeriodo) { this.idPeriodo = idPeriodo; }

    public Integer getPuntajeTotal() { return puntajeTotal; }
    public void setPuntajeTotal(Integer puntajeTotal) { this.puntajeTotal = puntajeTotal; }

    public String getComentarios() { return comentarios; }
    public void setComentarios(String comentarios) { this.comentarios = comentarios; }

    public LocalDateTime getFechaRealizada() { return fechaRealizada; }
    public void setFechaRealizada(LocalDateTime fechaRealizada) { this.fechaRealizada = fechaRealizada; }
}