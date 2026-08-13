package com.erp.teacher;

import com.erp.auth.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "teachers")
@PrimaryKeyJoinColumn(name = "user_id")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher extends User {
    private String department;
    private String interestedCourse;
    private LocalDate joinDate;

    @Transient
    @JsonProperty("teacherId")
    public String getTeacherId() {
        return getId() == null ? null : String.format("TCH%06d", getId());
    }
}
