package edu.boisestate.cloudcomputing.whiteboardapi.service;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.boisestate.cloudcomputing.whiteboardapi.dao.RoomDao;
import edu.boisestate.cloudcomputing.whiteboardapi.entity.Room;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.RoomAlreadyExistsException;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.RoomNotFoundException;
import edu.boisestate.cloudcomputing.whiteboardapi.util.ApiUtil;
import edu.boisestate.cloudcomputing.whiteboardapi.util.JSONTansformer;

/**
 * Handles API requests related to room, whiteboard and chat.
 */
@Path("/room")
public class RoomService {
	private ObjectMapper om = new ObjectMapper();
	private RoomDao roomDao = new RoomDao();

	@POST
	@Path("/create/{roomname}/userid/{userid}")
	@Produces(MediaType.APPLICATION_JSON)
	public String createRoom(@PathParam("roomname") String roomname,
			@PathParam("userid") Long userid) throws JsonProcessingException,
			RoomAlreadyExistsException {
		Room room = getRoomByName(roomname);
		if (room != null) {
			throw new RoomAlreadyExistsException(
					ApiUtil.formatError("Room already exists"));
		}

		room = roomDao.createRoom(roomname, userid);
		return om.writeValueAsString(room);
	}

	private Room getRoomByName(String roomname) {
		return roomDao.getRoomByName(roomname);
	}

	@GET
	@Path("/{roomname}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getRoomDetailByName(@PathParam("roomname") String roomname)
			throws JsonProcessingException, RoomNotFoundException {
		Room room = getRoomByName(roomname);
		if (room == null) {
			throw new RoomNotFoundException(
					ApiUtil.formatError("Room not found"));
		}

		return om.writeValueAsString(room);
	}

	@GET
	@Path("/getrooms")
	@Produces("application/json")
	public String getRoomsList() throws JsonProcessingException {
		ArrayList<Room> room = new ArrayList<Room>();
		String rooms = null;
		try {
			room = roomDao.getRoomsList();
			rooms = JSONTansformer.ConvertToJSON(room);
		} catch (Exception e) {
			throw e;
		}
		return rooms;
	}
}
