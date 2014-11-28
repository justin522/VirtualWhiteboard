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
	private String roomname;

	@Column
	private String board_content;

	@Column
	private String chat_content;

	@Column
	private Long userid;

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
	public String getBoardContent() {
		return board_content;
	}

	public void setBoardContent(String board_content) {
		this.board_content = board_content;
	}

	@JsonIgnore
	public String getChatContent() {
		return chat_content;
	}

	public void setChatContent(String chat_content) {
		this.chat_content = chat_content;
	}

	public Date getCreated() {
		return created;
	}

	@PrePersist
	protected void onCreate() {
		created = new Date();
	}

}
