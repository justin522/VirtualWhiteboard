package edu.boisestate.cloudcomputing.whiteboardapi.entity;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.Date;
import java.util.List;

import javax.persistence.*;

@Entity
@Table
public class Room {
	@Id
	@GeneratedValue
	private Long id;

	@Column
	private String roomname;

    @Transient
    private List<JsonNode> chat;

    @Transient
    private List<JsonNode> whiteboard;

	@Column(name = "created", nullable = false, updatable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date created;

	public Room(String roomname) {
		this.roomname = roomname;
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

    public List<JsonNode> getChat() {
        return chat;
    }

    public void setChat(List<JsonNode> chat) {
        this.chat = chat;
    }

    public List<JsonNode> getWhiteboard() {
        return whiteboard;
    }

    public void setWhiteboard(List<JsonNode> whiteboard) {
        this.whiteboard = whiteboard;
    }

    public Date getCreated() {
		return created;
	}

	@PrePersist
	protected void onCreate() {
		created = new Date();
	}
}
