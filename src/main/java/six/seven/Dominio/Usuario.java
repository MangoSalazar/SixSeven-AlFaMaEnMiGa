package six.seven.Dominio;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private String contrasena;

    @Column(nullable = false)
    private String rol; // "ALUMNO", "DOCENTE", "ADMIN"

    public Usuario() {}

    public Usuario(String matricula, String contrasena, String rol) {
        this.matricula = matricula;
        this.contrasena = contrasena;
        this.rol = rol;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    @Override
    public String toString() {
        return "Usuario{id=" + id + ", matricula='" + matricula + "', rol='" + rol + "'}";
    }
}