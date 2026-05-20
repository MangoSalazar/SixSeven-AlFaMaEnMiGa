package six.seven.Dominio;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "vw_horario_alumno")
public class HorarioAlumno {

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

    @Column(name = "grupo")
    private String grupo;

    @Column(name = "nombre_docente")
    private String nombreDocente;

    @Column(name = "dias")
    private String dias;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    @Column(name = "aula")
    private String aula;

    @Column(name = "periodo")
    private String periodo;

    public HorarioAlumno() {}

    public Integer getIdAlumno() { return idAlumno; }
    public String getMatricula() { return matricula; }
    public String getNombreAlumno() { return nombreAlumno; }
    public String getClaveMateria() { return claveMateria; }
    public String getNombreMateria() { return nombreMateria; }
    public String getGrupo() { return grupo; }
    public String getNombreDocente() { return nombreDocente; }
    public String getDias() { return dias; }
    public LocalTime getHoraInicio() { return horaInicio; }
    public LocalTime getHoraFin() { return horaFin; }
    public String getAula() { return aula; }
    public String getPeriodo() { return periodo; }
}
