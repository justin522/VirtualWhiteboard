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

    public void saveChatMessage(ChatMessage message) {
        session.getTransaction().begin();
        session.persist(message);
        session.getTransaction().commit();
    }

    @SuppressWarnings("unchecked")
    public List<ChatMessage> getMessagesByRoom(Long roomid) {
        try {
            return (List<ChatMessage>) session.createQuery("SELECT cm from ChatMessage cm WHERE cm.roomid = :roomid ORDER BY cm.created")
                    .setParameter("roomid", roomid)
                    .list();
        } catch (NoResultException e) {
            return new ArrayList<>();
        } finally {
            session.close();
        }
    }
}
