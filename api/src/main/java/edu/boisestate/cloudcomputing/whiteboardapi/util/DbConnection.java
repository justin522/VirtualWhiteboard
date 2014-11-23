package edu.boisestate.cloudcomputing.whiteboardapi.util;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

/**
 * Singleton class that returns an existing DB entity manager after creating
 * one if it did not already exist.
 */
public class DbConnection {
    private static EntityManagerFactory emf;
    private static DbConnection connection;

    private DbConnection() {
        emf = Persistence.createEntityManagerFactory("whiteboard");
    }

    public synchronized static EntityManager getEntityManager() {
        if (emf == null) {
            connection = new DbConnection();
        }
        return emf.createEntityManager();
    }

    public void dropEntityManager() {
        if (emf != null) {
            emf.close();
        }
    }
}
