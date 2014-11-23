package edu.boisestate.cloudcomputing.whiteboardapi.dao;

import edu.boisestate.cloudcomputing.whiteboardapi.util.DbConnection;
import edu.boisestate.cloudcomputing.whiteboardapi.entity.User;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;

/**
 * Handles DB reads/writes for the User table.
 */
public class UserDao {
    EntityManager em;

    public UserDao() {
        em = DbConnection.getEntityManager();
    }

    /**
     * Creates a new user.
     *
     * @param username The username for the new user.
     * @return The newly created user object.
     */
    public User createUser(String username) {
        User user = new User(username);

        em.getTransaction().begin();
        em.persist(user);
        em.getTransaction().commit();

        return user;
    }

    /**
     * Returns a user with the given username or null otherwise.
     *
     * @param username The username to look up.
     * @return The user object or null.
     */
    public User getUserByName(String username) {
        try {
            return em.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
                    .setParameter("username", username)
                    .getSingleResult();
        } catch (NoResultException ex) {
            return null;
        }
    }

    /**
     * Returns a user with the given user id or null otherwise.
     *
     * @param userid The user id to look up.
     * @return The user object or null.
     */
    public User getUserById(Long userid) {
        try {
            return em.createQuery("SELECT u FROM User u WHERE u.id = :userid", User.class)
                    .setParameter("userid", userid)
                    .getSingleResult();
        } catch (NoResultException ex) {
            return null;
        }
    }
}
