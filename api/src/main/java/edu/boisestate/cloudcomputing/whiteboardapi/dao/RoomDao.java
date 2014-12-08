package edu.boisestate.cloudcomputing.whiteboardapi.dao;

import javax.persistence.NoResultException;

import edu.boisestate.cloudcomputing.whiteboardapi.entity.Room;
import edu.boisestate.cloudcomputing.whiteboardapi.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.exception.ConstraintViolationException;

import java.util.ArrayList;
import java.util.List;

/**
 * Handles DB reads/writes for the Room table.
 * 
 * @author Milson
 *
 */
public class RoomDao {
	private Session session;

	public RoomDao() {
		session = HibernateUtil.getSessionFactory().openSession();
	}

	/**
	 * Create Room with Chat and Board
	 * 
	 * @param roomname
	 *            The roomname for the new Room.
	 * @return newly created Room
	 */
	public Room createRoom(String roomname) {
		Room room = new Room(roomname);

		try {
			session.getTransaction().begin();
			session.persist(room);
			session.getTransaction().commit();
		} catch (ConstraintViolationException e) {
			return null;
		} finally {
			if (session != null) {
				session.close();
			}
		}

		return room;
	}

	/**
	 * To get detail about Room when searched by roomname
	 * 
	 * @param roomname
	 *            The roomname for search
	 * @return detail about the searched room
	 */
	public Room getRoomByName(String roomname) {
		try {
			return (Room) session.createQuery("SELECT r FROM Room r WHERE r.roomname = :roomname")
					.setParameter("roomname", roomname)
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
	 * Search Room detail by roomid
	 * 
	 * @param roomid
	 *            search by roomid
	 * @return the detail about the room
	 */
	public Room getRoomById(Long roomid) {
		try {
			return (Room) session.createQuery("SELECT r FROM Room r WHERE r.id = :roomid")
					.setLong("roomid", roomid)
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
	 * To list all available Rooms
	 * 
	 * @return list of available Rooms
	 */
	@SuppressWarnings("unchecked")
	public List<Room> getRoomsList() {
		try {
			return (List<Room>) session.createQuery("SELECT r FROM Room r ORDER BY r.roomname")
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
