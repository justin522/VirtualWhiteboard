package edu.boisestate.cloudcomputing.whiteboardapi.dao;

import edu.boisestate.cloudcomputing.whiteboardapi.entity.ChatMessage;
import edu.boisestate.cloudcomputing.whiteboardapi.util.DbConnection;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import java.util.ArrayList;
import java.util.List;

/**
 * Handles DB reads/writes for the ChatMessage table.
 */
public class ChatDao {
    private EntityManager em;

    public ChatDao() {
        em = DbConnection.getEntityManager();
    }

    public void saveChatMessage(ChatMessage message) {
        em.getTransaction().begin();
        em.persist(message);
        em.getTransaction().commit();
    }

    public List<ChatMessage> getMessagesByRoom(Long roomid) {
        try {
            return em.createQuery("SELECT cm from ChatMessage cm WHERE cm.room = :roomid ORDER BY cm.created", ChatMessage.class)
                    .setParameter("roomid", roomid)
                    .getResultList();
        } catch (NoResultException e) {
            return new ArrayList<>();
        }
    }

    public void deleteMessagesByRoom(Long roomid) {
        em.createQuery("DELETE FROM ChatMessage cm WHERE cm.room = :roomid")
                .setParameter("roomid", roomid)
                .executeUpdate();
    }
}
