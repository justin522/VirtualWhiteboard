package edu.boisestate.cloudcomputing.whiteboardapi.dao;

import edu.boisestate.cloudcomputing.whiteboardapi.entity.ChatMessage;
import edu.boisestate.cloudcomputing.whiteboardapi.util.HibernateUtil;
import org.hibernate.Session;

import javax.persistence.NoResultException;
import java.util.ArrayList;
import java.util.List;

/**
 * Handles DB reads/writes for the ChatMessage table.
 */
public class ChatDao {
    private Session session;

    public ChatDao() {
        session = HibernateUtil.getSessionFactory().openSession();
    }

    /**
     * Saves a new chat message.
     *
     * @param message The data describing the message.
     */
    public void saveChatMessage(ChatMessage message) {
        try {
            session.getTransaction().begin();
            session.persist(message);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * Gets all of the chat messages in a particular room.
     *
     * @param roomid The ID of the room.
     * @return List of chat messages in the room.
     */
    @SuppressWarnings("unchecked")
    public List<ChatMessage> getMessagesByRoom(Long roomid) {
        try {
            return (List<ChatMessage>) session.createQuery("SELECT cm from ChatMessage cm WHERE cm.roomid = :roomid ORDER BY cm.id")
                    .setLong("roomid", roomid)
                    .list();
        } catch (NoResultException e) {
            return new ArrayList<>();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}
