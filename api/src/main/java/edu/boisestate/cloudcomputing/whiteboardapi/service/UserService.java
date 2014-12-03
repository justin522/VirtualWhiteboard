package edu.boisestate.cloudcomputing.whiteboardapi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.boisestate.cloudcomputing.whiteboardapi.entity.UserList;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.FailedLoginException;
import edu.boisestate.cloudcomputing.whiteboardapi.util.ApiUtil;
import edu.boisestate.cloudcomputing.whiteboardapi.dao.UserDao;
import edu.boisestate.cloudcomputing.whiteboardapi.entity.User;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.NotLoggedInException;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.UserAlreadyExistsException;
import edu.boisestate.cloudcomputing.whiteboardapi.exception.UserNotFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
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
     * Logs in the user with the given id. No password required.
     *
     * @param req The servlet request containing the session.
     * @param username The username of the user logging in.
     * @param password The password of the user logging in.
     * @return The user who is now logged in.
     * @throws JsonProcessingException
     */
    @POST
    @Path("/login/{username}/password/{password}")
    @Produces(MediaType.APPLICATION_JSON)
    public String loginUser(
            @Context HttpServletRequest req,
            @PathParam("username") String username,
            @PathParam("password") String password
    ) throws JsonProcessingException {
        User user = userDao.getUserByCreds(username, password);
        if (user == null) {
            throw new FailedLoginException(ApiUtil.formatError("Login failed"));
        }

        HttpSession session = req.getSession();
        session.setAttribute("userid", user.getId());

        return om.writeValueAsString(user);
    }

    /**
     * Utility method to get the logged-in user.
     *
     * @param req The servlet request containing the session.
     * @return The logged-in user.
     * @throws JsonProcessingException
     */
    public User getLoggedInUser(HttpServletRequest req) throws JsonProcessingException {
        HttpSession session = req.getSession();
        Long loggedInUserid = (Long) session.getAttribute("userid");
        if (loggedInUserid == null) {
            throw new NotLoggedInException(ApiUtil.formatError("You must be logged in"));
        }

        User loggedInUser = getUserById(loggedInUserid);
        if (loggedInUser == null) {
            throw new NotLoggedInException(ApiUtil.formatError("Session user is not valid"));
        }

        return loggedInUser;
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
