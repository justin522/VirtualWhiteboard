package edu.boisestate.cloudcomputing.whiteboardapi.dao;

import java.util.ArrayList;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;

import edu.boisestate.cloudcomputing.whiteboardapi.entity.Room;
import edu.boisestate.cloudcomputing.whiteboardapi.util.DbConnection;

public class RoomDao {
	private EntityManager em;

	public RoomDao() {
		em = DbConnection.getEntityManager();
	}

	public Room createRoom(String roomname, Long userid) {
		Room room = new Room(roomname, userid);

		em.getTransaction().begin();
		em.persist(room);
		em.getTransaction().commit();

		return room;
	}

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

	public Room getWhiteboardByRoom(Long roomid) {
		try {
			return em
					.createQuery("SELECT r FROM Room r WHERE r.id = :roomid",
							Room.class).setParameter("roomid", roomid)
					.getSingleResult();
		} catch (NoResultException ex) {
			return null;
		}
	}

	public Room getChatByRoom(Long roomid) {
		try {
			return em
					.createQuery("SELECT r FROM Room r WHERE r.id = :roomid",
							Room.class).setParameter("roomid", roomid)
					.getSingleResult();
		} catch (NoResultException ex) {
			return null;
		}
	}

	public ArrayList<Room> getRoomsList() {
		// TODO Auto-generated method stub
		return null;
	}
}
