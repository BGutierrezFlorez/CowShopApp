package org.example.modelo;

public class DetalleVentaRequest {
    private int idVaca;
    private double precio;
    private double descuento;

    public DetalleVentaRequest(int idVaca, double precio, double descuento){
        this.idVaca = idVaca;
        this.precio = precio;
        this.descuento = descuento;
    }

    public int getIdVaca(){
        return idVaca;
    }

    public void setIdVaca(int idVaca){
        this.idVaca = idVaca;
    }

    public double getPrecio(){
        return precio;
    }

    public void setPrecio(double precio){
        this.precio = precio;
    }

    public double getDescuento(){
        return descuento;
    }

    public void setDescuento(double descuento){
        this.descuento = descuento;
    }

}
