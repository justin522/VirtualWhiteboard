package edu.boisestate.cloudcomputing.whiteboardapi.service;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.boisestate.cloudcomputing.whiteboardapi.dao.ChatDao;
import edu.boisestate.cloudcomputing.whiteboardapi.dao.RoomDao;
import edu.boisestate.cloudcomputing.whiteboardapi.dao.WhiteboardDao;
import edu.boisestate.cloudcomputing.whiteboardapi.entity.*;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.RoomAlreadyExistsException;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.RoomNotFoundException;
import edu.boisestate.cloudcomputing.whiteboardapi.util.ApiUtil;

import java.io.IOException;
import java.util.List;

/**
 * Handles API requests related to room, whiteboard and chat.
 */
@Path("/room")
public class RoomService {
	private ObjectMapper om = new ObjectMapper();
	private RoomDao roomDao = new RoomDao();
    private ChatDao chatDao = new ChatDao();
    private WhiteboardDao whiteboardDao = new WhiteboardDao();

	/**
	 * Creates a new room with the given roomname.
	 * 
	 * @param roomname
	 *            The roomname for the new room.
	 * @param userid
	 *            The user who created the room.
	 * @return The newly created room.
	 * @throws JsonProcessingException
	 * @throws RoomAlreadyExistsException
	 */
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

	/**
	 * Gets the room with the given roomname
	 * 
	 * @param roomname
	 *            The roomname to look up.
	 * @return room detail with the given roomname.
	 */
	private Room getRoomByName(String roomname) {
		Room room = roomDao.getRoomByName(roomname);
        if (room == null) {
            return null;
        }

        List<ChatMessage> chat = chatDao.getMessagesByRoom(room.getId());
        room.setChat(chat);

        List<WhiteboardEdit> whiteboard = whiteboardDao.getEditsByRoom(room.getId());
        room.setWhiteboard(whiteboard);

        return room;
	}

	/**
	 * Gets the room deatil for given roomname
	 * 
	 * @param roomname
	 *            The roomname to look up.
	 * @return room detail with the given roomname.
	 * @throws JsonProcessingException
	 * @throws RoomNotFoundException
	 */
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

	/**
	 * To fetch all available Rooms
	 * 
	 * @return JSON of all available Rooms
	 * @throws JsonProcessingException
	 */
	@GET
	@Path("/getrooms")
	@Produces(MediaType.APPLICATION_JSON)
	public String getRoomsList() throws JsonProcessingException {
        List<Room> rooms = roomDao.getRoomsList();
        RoomList roomList = new RoomList(rooms);

        return om.writeValueAsString(roomList);
	}

    /**
     * Updates a room's chat with a new message.
     *
     * @param chatMessage The new message.
     * @return The newly saved message.
     * @throws IOException
     */
    @POST
    @Path("/updatechat")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateChat(ChatMessage chatMessage) throws IOException {
        chatDao.saveChatMessage(chatMessage);

        return om.writeValueAsString(chatMessage);
    }

    /**
     * Updates a room's whiteboard with a new edit.
     *
     * @param whiteboardEdit The new edit.
     * @return The newly saved edit.
     * @throws IOException
     */
    @POST
    @Path("/updateboard")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateBoard(WhiteboardEdit whiteboardEdit) throws IOException {
        whiteboardDao.saveWhiteboardEdit(whiteboardEdit);

        return om.writeValueAsString(whiteboardEdit);
    }
}
