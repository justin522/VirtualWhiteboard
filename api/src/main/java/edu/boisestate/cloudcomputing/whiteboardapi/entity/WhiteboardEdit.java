package edu.boisestate.cloudcomputing.whiteboardapi.entity;

import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table
public class WhiteboardEdit {
    @Id
    @GeneratedValue
    private Long id;

    @Column
    private Long userid;

    @Column
    private Long roomid;

    @Column
    @Type(type = "text")
    private String data;

    @Column(name = "created", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    public WhiteboardEdit() {
        created = new Date();
    }

    public Long getId() {
        return id;
    }

    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public Long getRoomid() {
        return roomid;
    }

    public void setRoomid(Long roomid) {
        this.roomid = roomid;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Date getCreated() {
        return created;
    }
}
