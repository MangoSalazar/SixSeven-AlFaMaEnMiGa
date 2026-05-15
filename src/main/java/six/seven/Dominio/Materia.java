package six.seven.Dominio;

import jakarta.persistence.*;

@Entity
@Table(name = "MATERIA")
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_materia")
    private Integer idMateria;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "clave", nullable = false, unique = true, length = 15)
    private String clave;

    @Column(name = "creditos")
    private Integer creditos = 5;

    @Column(name = "horas_teoricas")
    private Integer horasTeoricas = 0;

    @Column(name = "horas_practicas")
    private Integer horasPracticas = 0;

    public Materia() {}

    public Integer getIdMateria() { return idMateria; }
    public void setIdMateria(Integer idMateria) { this.idMateria = idMateria; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }

    public Integer getCreditos() { return creditos; }
    public void setCreditos(Integer creditos) { this.creditos = creditos; }

    public Integer getHorasTeoricas() { return horasTeoricas; }
    public void setHorasTeoricas(Integer horasTeoricas) { this.horasTeoricas = horasTeoricas; }

    public Integer getHorasPracticas() { return horasPracticas; }
    public void setHorasPracticas(Integer horasPracticas) { this.horasPracticas = horasPracticas; }
}
