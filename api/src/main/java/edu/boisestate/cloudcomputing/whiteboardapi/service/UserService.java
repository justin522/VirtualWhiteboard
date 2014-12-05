package edu.boisestate.cloudcomputing.whiteboardapi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.boisestate.cloudcomputing.whiteboardapi.entity.UserList;
import edu.boisestate.cloudcomputing.whiteboardapi.util.ApiUtil;
import edu.boisestate.cloudcomputing.whiteboardapi.dao.UserDao;
import edu.boisestate.cloudcomputing.whiteboardapi.entity.User;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.UserAlreadyExistsException;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.UserNotFoundException;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Handles API requests related to users.
 */
@Path("/users")
public class UserService {
    private ObjectMapper om = new ObjectMapper();
    private UserDao userDao = new UserDao();

    /**
     * Creates a new user with the given username.
     *
     * @param username The username for the new user.
     * @return The newly created user.
     * @throws JsonProcessingException
     */
    @POST
    @Path("/create/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public String createUser(
            @PathParam("username") String username
    ) throws JsonProcessingException {
        User user = getUserByName(username);
        if (user != null) {
            throw new UserAlreadyExistsException(ApiUtil.formatError("User already exists"));
        }

        user = userDao.createUser(username);
        return om.writeValueAsString(user);
    }

    /**
     * Gets the user id of the user with the given username.
     *
     * @param username The username to look up.
     * @return The user with that username.
     * @throws JsonProcessingException
     */
    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getUser(
            @PathParam("username") String username
    ) throws JsonProcessingException {
        User user = getUserByName(username);
        if (user == null) {
            throw new UserNotFoundException(ApiUtil.formatError("User not found"));
        }

        return om.writeValueAsString(user);
    }

    /**
     * Gets a list of all users.
     *
     * @return The list of users.
     * @throws JsonProcessingException
     */
    @GET
    @Path("/getusers")
    @Produces(MediaType.APPLICATION_JSON)
    public String getUsers() throws JsonProcessingException {
        List<User> users = userDao.getUsers();
        UserList userList = new UserList(users);

        return om.writeValueAsString(userList);
    }

    /**
     * Gets the user with the given username.
     *
     * @param username The username to look up.
     * @return The user with the given username.
     */
    public User getUserByName(String username) {
        return userDao.getUserByName(username);
    }

    /**
     * Gets the user with the given id.
     *
     * @param userid The id of the user to look up.
     * @return The user with the given id.
     */
    public User getUserById(Long userid) {
        return userDao.getUserById(userid);
    }
}
