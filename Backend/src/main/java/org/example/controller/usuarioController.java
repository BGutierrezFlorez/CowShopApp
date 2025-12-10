package controller;

import modelo.usuario;
import servicio.UsuarioServicio;

import java.util.List;

public class usuarioController {
    private usuarioService usuarioService;

    public usuarioController() {
        this.usuarioService = new UsuarioService();
    }

    public void registrarUsuario(Usuario usuario){
        boolean resultado = usuarioService.registrar(usuario);
        if(resultado){
            System.out.println("Usuario registrado Correctamente");
        } else {
            System.out.println("Usuario registrado Incorrecto");
        }
    }

    public void listarUsuarios(){
        list<Usuario> lista = usuarioService.listar();
        if (lista.isEmpty()) {
            System.out.println("No hay usuarios registrados");
        } else {
            for(Usuario u : lista){
                System.out.println(u.getId() + " - " + u.getNombre());
            }
        }
    }

    public void buscarUsuario(int id){
        Usuario usuario = usuarioService.BuscarPorId(id);
        if (usuario != null) {
            System.out.println("Usuario buscado Correctamente" + usuario.getNombre());
        } else {
            System.out.println("no existe un usuario con ese id");
        }
    }

    public void eliminarUsuario(int id){
        boolean eliminado = usuarioService.eliminar(id);
        if (eliminado) {
            System.out.println("Usuario eliminado correctamente");
        } else {
            System.out.println("Error al  eliminar usuario");
        }
    }
}