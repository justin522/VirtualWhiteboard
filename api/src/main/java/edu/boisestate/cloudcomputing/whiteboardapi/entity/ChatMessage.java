package edu.boisestate.cloudcomputing.whiteboardapi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table
public class ChatMessage {
    @Id
    @GeneratedValue
    private Long id;

    @Transient
    private String action;

    @Column
    private Long userid;

    @Transient
    private String user;

    @Column(name = "message")
    private String msg;

    @Column
    private Long roomid;

    @Transient
    private String room;

    @Column(name = "created", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    public ChatMessage() {
    }

    @JsonIgnore
    public Long getId() {
        return id;
    }

    public String getAction() {
        return "message";
    }

    @JsonIgnore
    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    @JsonIgnore
    public Long getRoomid() {
        return roomid;
    }

    public void setRoomid(Long roomid) {
        this.roomid = roomid;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    @JsonIgnore
    public Date getCreated() {
        return created;
    }

    @PrePersist
    protected void onCreate() {
        created = new Date();
    }
}
