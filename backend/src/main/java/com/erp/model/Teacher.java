package com.erp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    @Id
    private Long id;

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String department;
    private String interestedCourse;
    private Boolean active = true;

    @Transient
    @JsonProperty("teacherId")
    public String getTeacherId() {
        return id == null ? null : String.format("TCH%06d", id);
    }
}
