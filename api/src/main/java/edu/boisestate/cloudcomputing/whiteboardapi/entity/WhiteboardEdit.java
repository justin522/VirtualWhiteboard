package edu.boisestate.cloudcomputing.whiteboardapi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
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

    @Transient
    private String user;

    @Column
    private Long roomid;

    @Transient
    private String room;

    @Column(name = "data")
    @Type(type = "text")
    private String dataString;

    @Transient
    private JsonNode data;

    @Column(name = "created", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    public WhiteboardEdit() {
    }

    @JsonIgnore
    public Long getId() {
        return id;
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
    public String getDataString() {
        return dataString;
    }

    public void setDataString(String dataString) {
        this.dataString = dataString;
    }

    public JsonNode getData() {
        return data;
    }

    public void setData(JsonNode data) {
        this.data = data;
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
