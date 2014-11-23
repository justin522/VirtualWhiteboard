package edu.boisestate.cloudcomputing.whiteboardapi.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

public class FailedLoginException extends WebApplicationException {
    public FailedLoginException(String msg) {
        super(Response.status(Response.Status.FORBIDDEN).entity(msg)
                .type("text/plain").build());
    }
}
