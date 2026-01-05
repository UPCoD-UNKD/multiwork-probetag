package com.multiworkbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.multiworkbackend.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = { "memberProjects", "creatorProjects", "followingToProjects", "comments" })
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Table(name = "users")
public class User implements java.io.Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String username;
    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    @Column(columnDefinition = "TEXT")
    private String avatar;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ManyToMany
    @JoinTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private Set<Skill> skills;

    @ManyToMany
    @JoinTable(name = "user_links", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "link_id"))
    private Set<Link> links;

    @ManyToMany
    @JoinTable(name = "user_social_media", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "social_media_id"))
    private Set<SocialMedia> socialMediaSet;

    @ManyToMany(mappedBy = "members")
    private Set<Project> memberProjects;

    @ManyToMany
    @JoinTable(name = "user_following_projects", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "project_id"))
    private Set<Project> followingToProjects;

    @OneToMany(mappedBy = "creator")
    private Set<Project> creatorProjects;

    @ManyToMany
    @JoinTable(name = "user_collaborators", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "collaborator_id"))
    private Set<User> collaborators;

    @ManyToMany
    @JoinTable(name = "user_following", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "following_id"))
    private Set<User> following;

    @ManyToMany
    @JoinTable(name = "user_followers", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "follower_id"))
    private Set<User> followers;

    @OneToMany(mappedBy = "creator")
    private List<Comment> comments;

    // @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    // @CollectionTable
    @Enumerated(EnumType.STRING)
    private Role role;
}