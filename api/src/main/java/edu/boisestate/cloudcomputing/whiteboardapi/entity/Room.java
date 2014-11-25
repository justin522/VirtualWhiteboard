package edu.boisestate.cloudcomputing.whiteboardapi.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table
public class Room {
	 @Id
	    @GeneratedValue
	    private Long id;
	 
	    @Column
	    private Long whiteboardid;
	    
	    @Column
	    private Long chatid;

	    @Column
	    private String roomname;

	    @Column
	    private Long userid;
	    
	    @Column
	    private String content;

	    @Column(name = "created", nullable = false, updatable = false)
	    @Temporal(TemporalType.TIMESTAMP)
	    private Date created;

	    public Room(String roomname, Long userid) {
	        this.roomname = roomname;
	        this.userid = userid;
	    }

	    public Room() {
	    }

	    public Long getId() {
	        return id;
	    }

	    public String getRoomName() {
	        return roomname;
	    }

	    public void setRoomName(String roomname) {
	        this.roomname = roomname;
	    }

	    @JsonIgnore
	    public Long getWhiteboardID() {
	        return whiteboardid;
	    }

	    public void setWhiteboardID(Long whiteboardid) {
	        this.whiteboardid = whiteboardid;
	    }
	    
	    @JsonIgnore
	    public Long getChatID() {
	        return chatid;
	    }

	    public void Chat(Long chatid) {
	        this.chatid = chatid;
	    }

	    public Date getCreated() {
	        return created;
	    }

	    @PrePersist
	    protected void onCreate() {
	        created = new Date();
	    }  

}
