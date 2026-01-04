package com.multiworkbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "icons")
public class Icon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    // @Lob annotation broken since Hibernate 3.5 for postgres because it tried to map it to Blob not to bytea
    // but it by default maps to varbinary and that JDBC driver maps to bytea
    private byte[] image;
}
