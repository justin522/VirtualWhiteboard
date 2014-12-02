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

    @Column(name = "userid")
    private Long user;

    @Column(name = "message")
    private String msg;

    @Column(name = "roomid")
    private Long room;

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

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
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

    @PrePersist
    protected void onCreate() {
        created = new Date();
    }
}
