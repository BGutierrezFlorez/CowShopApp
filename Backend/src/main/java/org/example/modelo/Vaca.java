package org.example.modelo;

public class Vaca {
    private int idVaca;
    private String nombre;
    private  String raza;
    private int edad;
    private double peso;
    private double precio;
    private String estadoSalud;
    private int idVendedor;

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

    public void setNombre(String nombre){
        this.nombre = nombre;
    }
    public String getRaza(){
        return raza;
    }

    public void setRaza(String raza){
        this.raza = raza;
    }

    public int getEdad(){
        return edad;
    }

    public void setEdad(int edad){
        this.edad = edad;
    }

    public double getPeso(){
        return peso;
    }

    public void setPeso(double peso){
        this.peso = peso;
    }

    public double getPrecio(){
        return precio;
    }

    public void setPrecio(double precio){
        this.precio = precio;
    }

    public String getEstadoSalud(){
        return estadoSalud;
    }

    public void setEstadoSalud(String estadoSalud){
        this.estadoSalud = estadoSalud;
    }

    public int getIdVendedor(){
        return idVendedor;
    }

    public void setIdVendedor(int idVendedor){
        this.idVendedor = idVendedor;
    }

    @Override
    public String toString(){
        return "Vaca {" +
                "idVaca=" + idVaca +
                ", nombre=" + nombre + '\'' +
                ", raza=" + raza + '\'' +
                ", edad=" + edad +
                ", peso=" + peso +
                ", precio=" + precio +
                ", estadoSalud=" + estadoSalud + '\'' +
                ", idVendedor=" + idVendedor + "}";


    }
}
