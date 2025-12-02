package org.example.modelo;

import java.time.ZonedDateTime;

public class usuario {
    private int idUsuario;
    private String cedula;
    private ZonedDateTime fechaDeNacimiento;
    private String correo;
    private String celular;
    private String tipoDeUsuario;
    private int idMembresia;
    private String contraseña;
    private int idRol;

    public usuario(int idUsuario, String cedula, ZonedDateTime fechaDeNacimiento, String correo, 
        String celular, String tipoDeUsuario, int idMembresia, String contraseña, int idRol
    ){
        this.idUsuario = idUsuario;
        this.cedula = cedula;
        this.fechaDeNacimiento = fechaDeNacimiento;
        this.correo = correo;
        this.celular = celular;
        this.tipoDeUsuario = tipoDeUsuario;
        this.idMembresia = idMembresia;
        this.contraseña = contraseña;
        this.idRol = idRol;
    }
    
    public int getIdUsuario(){
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario){
        this.idUsuario = idUsuario;
    }
        
    public String getCedula(){
        return cedula;
    }

    public void setCedula(String cedula){
        this.cedula = cedula;   
    }

    public ZonedDateTime getFechaDeNacimiento(){
        return fechaDeNacimiento;
    }

    public void setFechaDeNacimiento(ZonedDateTime fechaDeNacimiento){
        this.fechaDeNacimiento = fechaDeNacimiento;
    }

    public String getCorreo(){
        return correo;
    }

    public void setCorreo(String correo){
        this.correo = correo;
    }

    public String getCelular(){
        return celular;
    }

    public void setCelular(String celular){
        this.celular = celular;
    }

    public String getTipoDeUsuario(){
        return tipoDeUsuario;
    }

    public void setTipoDeUsuario(String tipoDeUsuario){
        this.tipoDeUsuario = tipoDeUsuario;
    }

    public int getIdMembresia(){
        return idMembresia;
    }

    public void setIdMembresia(int idMembresia){
        this.idMembresia = idMembresia;
    }

    public String getContraseña(){
        return contraseña;
    }

    public void setContraseña(String contraseña){
        this.contraseña = contraseña;
    }

    public int getIdRol(){
        return idRol;
    }

    public void setIdRol(int idRol){
        this.idRol = idRol;
    }
    }


