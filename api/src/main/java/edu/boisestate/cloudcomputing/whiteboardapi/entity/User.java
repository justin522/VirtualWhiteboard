package edu.boisestate.cloudcomputing.whiteboardapi.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table
public class User {
    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String username;

    @Column(name = "created", nullable = false, updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    public User(String username) {
        this.username = username;
    }

    public User() {
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Date getCreated() {
        return created;
    }

    @PrePersist
    protected void onCreate() {
        created = new Date();
    }
}
