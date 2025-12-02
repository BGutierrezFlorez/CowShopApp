package org.example.modelo;

public class DetalleVenta {
    private int idDetalleVenta;
    private int idVenta;
    private int idVaca;

    public DetalleVenta(int idDetalleVenta, int idVenta, int idVaca){
        this.idDetalleVenta = idDetalleVenta;
        this.idVenta = idVenta;
        this.idVaca = idVaca;
    }

    public int getIdDetalleVenta(){
        return idDetalleVenta;
    }

    public void setIdDetalleVenta(int idDetalleVenta){
        this.idDetalleVenta = idDetalleVenta;
    }

    public int getIdVenta(){
        return idVenta;
    }

    public void setIdVenta(int idVenta){
        this.idVenta = idVenta;
    }

    public int getIdVaca(){
        return idVaca;
    }

    public void setIdVaca(int idVaca){
        this.idVaca = idVaca;
    }
}
