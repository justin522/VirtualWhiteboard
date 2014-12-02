package edu.boisestate.cloudcomputing.whiteboardapi.entity;

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

	@Column
	private Long userid;

    @Transient
    private List<ChatMessage> chat;

    @Transient
    private List<WhiteboardEdit> whiteboard;

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

    public List<ChatMessage> getChat() {
        return chat;
    }

    public void setChat(List<ChatMessage> chat) {
        this.chat = chat;
    }

    public List<WhiteboardEdit> getWhiteboard() {
        return whiteboard;
    }

    public void setWhiteboard(List<WhiteboardEdit> whiteboard) {
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
