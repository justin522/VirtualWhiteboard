package edu.boisestate.cloudcomputing.whiteboardapi.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class RoomNotFoundException extends WebApplicationException {
	public RoomNotFoundException(String msg) {
		super(Response.status(Response.Status.NOT_FOUND).entity(msg)
				.type("text/plain").build());
	}

}
