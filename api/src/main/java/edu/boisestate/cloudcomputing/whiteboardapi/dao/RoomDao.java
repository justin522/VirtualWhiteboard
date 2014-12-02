package edu.boisestate.cloudcomputing.whiteboardapi.dao;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;

import edu.boisestate.cloudcomputing.whiteboardapi.entity.Room;
import edu.boisestate.cloudcomputing.whiteboardapi.util.DbConnection;

import java.util.ArrayList;
import java.util.List;

/**
 * Handles DB reads/writes for the Room table.
 * 
 * @author Milson
 *
 */
public class RoomDao {
	private EntityManager em;

	public RoomDao() {
		em = DbConnection.getEntityManager();
	}

	/**
	 * Create Room with Chat and Board
	 * 
	 * @param roomname
	 *            The roomname for the new Room.
	 * @param userid
	 *            The userid who created it
	 * @return newly created Room
	 */
	public Room createRoom(String roomname, Long userid) {
		Room room = new Room(roomname, userid);

		em.getTransaction().begin();
		em.persist(room);
		em.getTransaction().commit();

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
			return em
					.createQuery(
							"SELECT r FROM Room r WHERE r.roomname = :roomname",
							Room.class).setParameter("roomname", roomname)
					.getSingleResult();
		} catch (NoResultException ex) {
			return null;
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
			return em
					.createQuery("SELECT r FROM Room r WHERE r.id = :roomid",
							Room.class).setParameter("roomid", roomid)
					.getSingleResult();
		} catch (NoResultException ex) {
			return null;
		}
	}

	/**
	 * Get the Board Content of a particular Room
	 * 
	 * @param roomid
	 *            search by roomid
	 * @return the WhiteBoard detail of a room
	 */
	public Room getBoardContentByRoom(Long roomid) {
		try {
			return em
					.createQuery("SELECT r FROM Room r WHERE r.id = :roomid",
							Room.class).setParameter("roomid", roomid)
					.getSingleResult();
		} catch (NoResultException ex) {
			return null;
		}
	}

	/**
	 * Get the Chat Content of a particular Room
	 * 
	 * @param roomid
	 *            search by roomid
	 * @return the Chat detail of a room
	 */
	public Room getChatContentByRoom(Long roomid) {
		try {
			return em
					.createQuery("SELECT r FROM Room r WHERE r.id = :roomid",
							Room.class).setParameter("roomid", roomid)
					.getSingleResult();
		} catch (NoResultException ex) {
			return null;
		}
	}

	/**
	 * To list all available Rooms
	 * 
	 * @return list of available Rooms
	 */
	public List<Room> getRoomsList() {
		try {
			return em.createQuery("SELECT r FROM Room r ORDER BY r.roomname", Room.class)
					.getResultList();
		} catch (NoResultException ex) {
			return new ArrayList<>();
		}
	}
}
