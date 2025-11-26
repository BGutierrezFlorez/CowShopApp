package org.example.modelo;

public class Vaca {
    public int idVaca;
    public String nombre;
    public String raza;
    public int edad;
    public double peso;
    public double precio;
    public String estadoSalud;
    public int idVendedor;

    public Vaca(int idVaca,String nombre, String raza, int edad,
                double peso, double precio, String estadoSalud, int idVendedor){
        this.idVaca = idVaca;
        this.nombre = nombre;
        this.raza = raza;
        this.edad = edad;
        this.peso = peso;
        this.precio = precio;
        this.estadoSalud = estadoSalud;
        this.idVendedor = idVendedor;

    }

    public int getIdVaca() {
        return idVaca;
    }

    public void setIdVaca(int idVaca){
        this.idVaca = idVaca;
    }

    public String getNombre(){
        return raza;
    }

    public void setNombre(){
        this.nombre = nombre;
    }
}
