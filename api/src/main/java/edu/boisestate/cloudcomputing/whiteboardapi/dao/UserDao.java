package edu.boisestate.cloudcomputing.whiteboardapi.dao;

import edu.boisestate.cloudcomputing.whiteboardapi.entity.User;
import edu.boisestate.cloudcomputing.whiteboardapi.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.exception.ConstraintViolationException;

import javax.persistence.NoResultException;
import java.util.ArrayList;
import java.util.List;

/**
 * Handles DB reads/writes for the User table.
 */
public class UserDao {
    private Session session;

    public UserDao() {
        session = HibernateUtil.getSessionFactory().openSession();
    }

    /**
     * Creates a new user.
     *
     * @param username The username for the new user.
     * @param password The password for the new user.
     * @return The newly created user object.
     */
    public User createUser(String username, String password) {
        User user = new User(username, password);

        try {
            session.getTransaction().begin();
            session.persist(user);
            session.getTransaction().commit();
        } catch (ConstraintViolationException e) {
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }

        return user;
    }

    /**
     * Creates a new user with a blank password.
     *
     * @param username The username for the new user.
     * @return The newly created user object.
     */
    public User createUser(String username) {
        return createUser(username, "");
    }

    /**
     * Returns a user with the given username or null otherwise.
     *
     * @param username The username to look up.
     * @return The user object or null.
     */
    public User getUserByName(String username) {
        try {
            return (User) session.createQuery("SELECT u FROM User u WHERE u.username = :username")
                    .setParameter("username", username)
                    .uniqueResult();
        } catch (NoResultException ex) {
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
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
            return (User) session.createQuery("SELECT u FROM User u WHERE u.id = :userid")
                    .setLong("userid", userid)
                    .uniqueResult();
        } catch (NoResultException ex) {
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * Returns a list of all users.
     *
     * @return The list of users.
     */
    @SuppressWarnings("unchecked")
    public List<User> getUsers() {
        try {
            return (List<User>) session.createQuery("SELECT u FROM User u ORDER BY u.username")
                    .list();
        } catch (NoResultException ex) {
            return new ArrayList<>();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}
