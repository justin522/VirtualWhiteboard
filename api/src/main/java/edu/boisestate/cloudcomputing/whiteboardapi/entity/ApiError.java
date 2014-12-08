package edu.boisestate.cloudcomputing.whiteboardapi.entity;

public class ApiError {
    private String error;

    public ApiError(String error) {
        this.error = error;
    }

    public ApiError() {
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
