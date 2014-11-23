package edu.boisestate.cloudcomputing.whiteboardapi.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class NotLoggedInException extends WebApplicationException {
    public NotLoggedInException(String msg) {
        super(Response.status(Response.Status.UNAUTHORIZED).entity(msg)
                .type("text/plain").build());
    }
}
