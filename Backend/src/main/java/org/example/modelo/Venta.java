package org.example.modelo;
import java.time.LocalDateTime;
import java.util.List;


public class Venta {
    private int idVenta;
    private int idComprador;
    private LocalDateTime fechaVenta;
    private double total;
    private List<DetalleVenta> Detalles;
    public Venta(int idVenta, int idComprador, LocalDateTime fechaVenta, double total){
        this.idVenta = idVenta;
        this.idComprador = idComprador;
        this.fechaVenta = fechaVenta;
        this.total = total;
    }

    // Getter and Setter
    public int getIdVenta(){
        return idVenta;
    }

    public void setIdVenta(int idVenta){
        this.idVenta = idVenta;
    }

    public int getIdComprador(){
        return idComprador;
    }

    public void setIdComprador(int idComprador){
        this.idComprador = idComprador;
    }

    public LocalDateTime getFechaVenta(){
        return fechaVenta;
    }

    public void setFechaVenta(LocalDateTime fechaVenta){
        this.fechaVenta = fechaVenta;
    }

    public double getTotal(){
        return total;
    }

    public void setTotal(double total){
        this.total = total;
    }


}
