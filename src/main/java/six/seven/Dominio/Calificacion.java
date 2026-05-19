package six.seven.Dominio;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "CALIFICACION")
public class Calificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_calificacion")
    private Integer idCalificacion;

    @Column(name = "id_alumno", nullable = false)
    private Integer idAlumno;

    @Column(name = "id_asignacion", nullable = false)
    private Integer idAsignacion;

    @Column(name = "parcial_1", precision = 5, scale = 2)
    private BigDecimal parcial1 = BigDecimal.ZERO;

    @Column(name = "parcial_2", precision = 5, scale = 2)
    private BigDecimal parcial2 = BigDecimal.ZERO;

    @Column(name = "parcial_3", precision = 5, scale = 2)
    private BigDecimal parcial3 = BigDecimal.ZERO;

    @Column(name = "nota_final", precision = 5, scale = 2)
    private BigDecimal notaFinal = BigDecimal.ZERO;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    public Calificacion() {}

    public Integer getIdCalificacion() { return idCalificacion; }
    public void setIdCalificacion(Integer idCalificacion) { this.idCalificacion = idCalificacion; }

    public Integer getIdAlumno() { return idAlumno; }
    public void setIdAlumno(Integer idAlumno) { this.idAlumno = idAlumno; }

    public Integer getIdAsignacion() { return idAsignacion; }
    public void setIdAsignacion(Integer idAsignacion) { this.idAsignacion = idAsignacion; }

    public BigDecimal getParcial1() { return parcial1; }
    public void setParcial1(BigDecimal parcial1) { this.parcial1 = parcial1; }

    public BigDecimal getParcial2() { return parcial2; }
    public void setParcial2(BigDecimal parcial2) { this.parcial2 = parcial2; }

    public BigDecimal getParcial3() { return parcial3; }
    public void setParcial3(BigDecimal parcial3) { this.parcial3 = parcial3; }

    public BigDecimal getNotaFinal() { return notaFinal; }
    public void setNotaFinal(BigDecimal notaFinal) { this.notaFinal = notaFinal; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}