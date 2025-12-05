package org.example.modelo;

import java.time.LocalDateTime;

public class Membresia {
    public int idMembresia;
    public String nombreMembresia;
    public int valorMembresia;
    public LocalDateTime fechaCrecion;
    public LocalDateTime fechaModificacion;
    public boolean estado = true;

    public Membresia(int idMembresia, String nombreMembresia, int valorMembresia, 
        LocalDateTime fechaCreacion, LocalDateTime fechaModificacion, boolean estado){

            this.idMembresia = idMembresia;
            this.nombreMembresia = nombreMembresia;
            this.valorMembresia = valorMembresia;
            this.fechaCrecion = fechaCreacion;
            this.fechaModificacion = fechaModificacion;
           

    }

    public int getIdMembresia(){
        return idMembresia;
    }

    public void setIdMembresia(int idMembresia){

        this.idMembresia = idMembresia;
    }
    
    public String getNombreMembresia(){
        return nombreMembresia;
    }

    public void setNombreMembresia(String nombreMembresia){

        this.nombreMembresia = nombreMembresia;
    }

    public int getValorMembresia(){
        return valorMembresia;
    }

    public void setValorMembresia(int valorMembresia){

        this.valorMembresia = valorMembresia;
    }

    public LocalDateTime getFechaCreacion(){
        return fechaCrecion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion){

        this.fechaCrecion = fechaCreacion;
    }

    public LocalDateTime getFechaModificacion(){
        return fechaModificacion;
    }

    public void setFechaModificacion(LocalDateTime fechaModificacion){

        this.fechaModificacion = fechaModificacion;
    }

    public boolean isEstado(){
        return estado;
    }

    public void setEstado(boolean estado){

        this.estado = estado;
    }
    }

