package edu.boisestate.cloudcomputing.whiteboardapi.dao;

import edu.boisestate.cloudcomputing.whiteboardapi.entity.WhiteboardEdit;
import edu.boisestate.cloudcomputing.whiteboardapi.util.DbConnection;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import java.util.ArrayList;
import java.util.List;

/**
 * Handles DB reads/writes for the WhiteboardEdit table.
 */
public class WhiteboardDao {
    private EntityManager em;

    public WhiteboardDao() {
        em = DbConnection.getEntityManager();
    }

    public void saveWhiteboardEdit(WhiteboardEdit whiteboardEdit) {
        em.getTransaction().begin();
        em.persist(whiteboardEdit);
        em.getTransaction().commit();
    }

    public List<WhiteboardEdit> getEditsByRoom(Long roomid) {
        try {
            return em.createQuery("SELECT we FROM WhiteboardEdit we WHERE we.room = :roomid ORDER BY created", WhiteboardEdit.class)
                    .setParameter("roomid", roomid)
                    .getResultList();
        } catch (NoResultException e) {
            return new ArrayList<>();
        }
    }

    public void deleteEditsByRoom(Long roomid) {
        em.createQuery("DELETE FROM WhiteboardEdit we WHERE we.room = :roomid")
                .setParameter("roomid", roomid)
                .executeUpdate();
    }
}
