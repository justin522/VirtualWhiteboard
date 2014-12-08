package edu.boisestate.cloudcomputing.whiteboardapi.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class RoomAlreadyExistsException extends WebApplicationException {
	public RoomAlreadyExistsException(String msg) {
		super(Response.status(Response.Status.FORBIDDEN).entity(msg)
				.type("text/plain").build());
	}
}
