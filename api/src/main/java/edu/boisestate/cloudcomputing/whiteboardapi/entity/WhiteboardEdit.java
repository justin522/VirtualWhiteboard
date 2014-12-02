package edu.boisestate.cloudcomputing.whiteboardapi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table
public class WhiteboardEdit {
    @Id
    @GeneratedValue
    private Long id;

    @Transient
    private String action;

    @Column(name = "userid")
    private Long user;

    @Column
    private String type;

    @Column
    private String layer;

    @Column
    private Integer prevX;

    @Column
    private Integer prevY;

    @Column
    private Integer currX;

    @Column
    private Integer currY;

    @Column
    private String strokeColor;

    @Column
    private Integer strokeWidth;

    @Column(name = "roomid")
    private Long room;

    @Column(name = "created", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    public WhiteboardEdit() {
    }

    @JsonIgnore
    public Long getId() {
        return id;
    }

    public String getAction() {
        return "draw";
    }

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLayer() {
        return layer;
    }

    public void setLayer(String layer) {
        this.layer = layer;
    }

    public Integer getPrevX() {
        return prevX;
    }

    public void setPrevX(Integer prevX) {
        this.prevX = prevX;
    }

    public Integer getPrevY() {
        return prevY;
    }

    public void setPrevY(Integer prevY) {
        this.prevY = prevY;
    }

    public Integer getCurrX() {
        return currX;
    }

    public void setCurrX(Integer currX) {
        this.currX = currX;
    }

    public Integer getCurrY() {
        return currY;
    }

    public void setCurrY(Integer currY) {
        this.currY = currY;
    }

    public String getStrokeColor() {
        return strokeColor;
    }

    public void setStrokeColor(String strokeColor) {
        this.strokeColor = strokeColor;
    }

    public Integer getStrokeWidth() {
        return strokeWidth;
    }

    public void setStrokeWidth(Integer strokeWidth) {
        this.strokeWidth = strokeWidth;
    }

    public Long getRoom() {
        return room;
    }

    public void setRoom(Long room) {
        this.room = room;
    }

    @JsonIgnore
    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    @PrePersist
    protected void onCreate() {
        created = new Date();
    }
}
