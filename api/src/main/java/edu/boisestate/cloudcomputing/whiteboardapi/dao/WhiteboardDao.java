package edu.boisestate.cloudcomputing.whiteboardapi.dao;

import edu.boisestate.cloudcomputing.whiteboardapi.entity.WhiteboardEdit;
import edu.boisestate.cloudcomputing.whiteboardapi.util.HibernateUtil;
import org.hibernate.Session;

import javax.persistence.NoResultException;
import java.util.ArrayList;
import java.util.List;

/**
 * Handles DB reads/writes for the WhiteboardEdit table.
 */
public class WhiteboardDao {
    private Session session;

    public WhiteboardDao() {
        session = HibernateUtil.getSessionFactory().openSession();
    }

    public void saveWhiteboardEdit(WhiteboardEdit whiteboardEdit) {
        session.getTransaction().begin();
        session.persist(whiteboardEdit);
        session.getTransaction().commit();
    }

    @SuppressWarnings("unchecked")
    public List<WhiteboardEdit> getEditsByRoom(Long roomid) {
        try {
            return (List<WhiteboardEdit>) session.createQuery("SELECT we FROM WhiteboardEdit we WHERE we.roomid = :roomid ORDER BY created")
                    .setParameter("roomid", roomid)
                    .list();
        } catch (NoResultException e) {
            return new ArrayList<>();
        } finally {
            session.close();
        }
    }
}
