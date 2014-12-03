package edu.boisestate.cloudcomputing.whiteboardapi.service;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.boisestate.cloudcomputing.whiteboardapi.dao.ChatDao;
import edu.boisestate.cloudcomputing.whiteboardapi.dao.RoomDao;
import edu.boisestate.cloudcomputing.whiteboardapi.dao.WhiteboardDao;
import edu.boisestate.cloudcomputing.whiteboardapi.entity.*;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.RoomAlreadyExistsException;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.RoomNotFoundException;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.UserNotFoundException;
import edu.boisestate.cloudcomputing.whiteboardapi.util.ApiUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Handles API requests related to room, whiteboard and chat.
 */
@Path("/room")
public class RoomService {
	private ObjectMapper om = new ObjectMapper();
    private UserService userService = new UserService();
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
		Room room = roomDao.getRoomByName(roomname);
		if (room != null) {
			throw new RoomAlreadyExistsException(
					ApiUtil.formatError("Room already exists"));
		}

		room = roomDao.createRoom(roomname, userid);
		return om.writeValueAsString(room);
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
			throws IOException, RoomNotFoundException {
		Room room = roomDao.getRoomByName(roomname);
		if (room == null) {
			throw new RoomNotFoundException(
					ApiUtil.formatError("Room not found"));
		}

        List<JsonNode> chat = new ArrayList<>();
        List<ChatMessage> messages = chatDao.getMessagesByRoom(room.getId());
        for (ChatMessage message : messages) {
            chat.add(om.readTree(message.getData()));
        }
        room.setChat(chat);

        List<JsonNode> whiteboard = new ArrayList<>();
        List<WhiteboardEdit> edits = whiteboardDao.getEditsByRoom(room.getId());
        for (WhiteboardEdit edit : edits) {
            whiteboard.add(om.readTree(edit.getData()));
        }
        room.setWhiteboard(whiteboard);

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
     * @param json The new message in JSON.
     * @param roomname The room in which the message was posted.
     * @param username The user who posted the message.
     * @return The newly saved message.
     * @throws IOException
     */
    @POST
    @Path("/updatechat/{room}/user/{user}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateChat(JsonNode json,
                             @PathParam("room") String roomname,
                             @PathParam("user") String username
    ) throws IOException {
        Room room = roomDao.getRoomByName(roomname);
        if (room == null) {
            throw new RoomNotFoundException(ApiUtil.formatError("Room not found"));
        }

        User user = userService.getUserByName(username);
        if (user == null) {
            throw new UserNotFoundException(ApiUtil.formatError("User not found"));
        }

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setUserid(user.getId());
        chatMessage.setRoomid(room.getId());
        chatMessage.setData(json.toString());

        chatDao.saveChatMessage(chatMessage);

        return om.writeValueAsString(chatMessage);
    }

    /**
     * Updates a room's whiteboard with a new edit.
     *
     * @param json The new edit in JSON.
     * @param roomname The room in which the edit was made.
     * @param username The user who made the edit.
     * @return The newly saved edit.
     * @throws IOException
     */
    @POST
    @Path("/updateboard/{room}/user/{user}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateBoard(JsonNode json,
                              @PathParam("room") String roomname,
                              @PathParam("user") String username
    ) throws IOException {
        Room room = roomDao.getRoomByName(roomname);
        if (room == null) {
            throw new RoomNotFoundException(ApiUtil.formatError("Room not found"));
        }

        User user = userService.getUserByName(username);
        if (user == null) {
            throw new UserNotFoundException(ApiUtil.formatError("User not found"));
        }

        WhiteboardEdit whiteboardEdit = new WhiteboardEdit();
        whiteboardEdit.setRoomid(room.getId());
        whiteboardEdit.setUserid(user.getId());
        whiteboardEdit.setData(json.toString());

        whiteboardDao.saveWhiteboardEdit(whiteboardEdit);

        return om.writeValueAsString(whiteboardEdit);
    }
}
