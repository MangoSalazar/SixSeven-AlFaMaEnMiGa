package six.seven.Dominio;
import jakarta.persistence.*;

@Entity
@Table(name = "GRUPO")
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grupo")
    private Integer idGrupo;

    @Column(name = "nombre_grupo", nullable = false, length = 20)
    private String nombreGrupo;

    @Column(name = "capacidad")
    private Integer capacidad = 30;

    @Column(name = "id_periodo", nullable = false)
    private Integer idPeriodo;

    public Grupo() {}

    public Integer getIdGrupo() { return idGrupo; }
    public void setIdGrupo(Integer idGrupo) { this.idGrupo = idGrupo; }

    public String getNombreGrupo() { return nombreGrupo; }
    public void setNombreGrupo(String nombreGrupo) { this.nombreGrupo = nombreGrupo; }

    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }

    public Integer getIdPeriodo() { return idPeriodo; }
    public void setIdPeriodo(Integer idPeriodo) { this.idPeriodo = idPeriodo; }
}
