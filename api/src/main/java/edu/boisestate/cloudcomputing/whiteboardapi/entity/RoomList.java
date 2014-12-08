package edu.boisestate.cloudcomputing.whiteboardapi.entity;

import java.util.List;

public class RoomList {
	private List<Room> rooms;

	public RoomList(List<Room> rooms) {
		this.rooms = rooms;
	}

	public RoomList() {
	}

	public List<Room> getRooms() {
		return rooms;
	}

	public void setRooms(List<Room> rooms) {
		this.rooms = rooms;
	}
}
