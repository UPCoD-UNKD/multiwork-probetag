package com.multiworkbackend.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.multiworkbackend.enums.ProjectStatus;
import com.multiworkbackend.enums.ProjectType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = { "members", "followers", "comments", "creator", "version" })
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Table(name = "projects")
public class Project implements java.io.Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    private String projectName;

    private Long position;

    private Integer budget;

    private Integer preferredTeamSize; // Preferred team size for the project

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToMany
    @JoinTable(name = "project_members", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> members;

    @ManyToMany
    @JoinTable(name = "project_followers", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> followers;

    @ManyToMany
    @JoinTable(name = "project_skills", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private Set<Skill> skills;

    @Lob
    private byte[] projectPhoto;

    private String description;

    @ManyToMany
    @JoinTable(name = "project_social_media", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "social_media_id"))
    private Set<SocialMedia> socialMediaSet;

    @OneToMany(mappedBy = "project")
    private Set<Comment> comments;

    @ElementCollection(targetClass = ProjectStatus.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "project_project_statuses", joinColumns = @JoinColumn(name = "project_id"))
    @Enumerated(EnumType.STRING)
    private Set<ProjectStatus> projectStatuses;

    @ElementCollection(targetClass = ProjectType.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "project_project_types", joinColumns = @JoinColumn(name = "project_id"))
    @Enumerated(EnumType.STRING)
    private Set<ProjectType> projectTypes;

    public void addMember(User user) {
        if (this.members == null) {
            this.members = new HashSet<>();
        }
        this.members.add(user);
    }

    public void addComment(Comment comment) {
        if (this.comments == null) {
            this.comments = new HashSet<>();
        }
        this.comments.add(comment);
        comment.setProject(this);
    }

    public void follow(User user) {
        if (this.followers == null) {
            this.followers = new HashSet<>();
        }
        this.followers.add(user);
    }
}
