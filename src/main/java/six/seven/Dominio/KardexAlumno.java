package six.seven.Dominio;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vw_kardex_alumno")
public class KardexAlumno {

    @Id
    @Column(name = "id_alumno")
    private Integer idAlumno;

    @Column(name = "matricula")
    private String matricula;

    @Column(name = "nombre_alumno")
    private String nombreAlumno;

    @Column(name = "clave_materia")
    private String claveMateria;

    @Column(name = "nombre_materia")
    private String nombreMateria;

    @Column(name = "creditos")
    private Integer creditos;

    @Column(name = "nota_final")
    private BigDecimal notaFinal;

    @Column(name = "estatus_materia")
    private String estatusMateria;

    @Column(name = "periodo")
    private String periodo;

    public KardexAlumno() {}

    public Integer getIdAlumno() { return idAlumno; }
    public String getMatricula() { return matricula; }
    public String getNombreAlumno() { return nombreAlumno; }
    public String getClaveMateria() { return claveMateria; }
    public String getNombreMateria() { return nombreMateria; }
    public Integer getCreditos() { return creditos; }
    public BigDecimal getNotaFinal() { return notaFinal; }
    public String getEstatusMateria() { return estatusMateria; }
    public String getPeriodo() { return periodo; }
}