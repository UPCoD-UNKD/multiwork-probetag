package com.multiworkbackend.util;

import com.multiworkbackend.entity.Project;
import com.multiworkbackend.entity.Skill;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Utility class for calculating similarity between projects based on skills.
 * Uses Jaccard similarity coefficient: intersection / union of skill sets.
 * 
 * This class follows Single Responsibility Principle by focusing solely on
 * similarity calculation logic.
 */
@Component
public class ProjectSimilarityCalculator {

    /**
     * Calculates maximum similarity score between a project and target projects.
     * Similarity is calculated using Jaccard coefficient based on common skills.
     * 
     * @param project the project to calculate similarity for
     * @param targetProjectSkills map of target project IDs to their skill IDs
     * @return similarity score (0.0 to 1.0), where 1.0 means identical skill sets
     */
    public double calculateMaxSimilarity(Project project, Map<Long, Set<Long>> targetProjectSkills) {
        if (project == null || project.getSkills() == null || targetProjectSkills == null || targetProjectSkills.isEmpty()) {
            return 0.0;
        }

        Set<Long> projectSkills = project.getSkills().stream()
                .map(Skill::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (projectSkills.isEmpty()) {
            return 0.0;
        }

        double maxSimilarity = 0.0;

        for (Set<Long> targetSkills : targetProjectSkills.values()) {
            if (targetSkills == null || targetSkills.isEmpty()) {
                continue;
            }

            // Calculate Jaccard similarity: |A ∩ B| / |A ∪ B|
            // Simplified to: |A ∩ B| / max(|A|, |B|) for efficiency
            Set<Long> intersection = new HashSet<>(projectSkills);
            intersection.retainAll(targetSkills);

            double similarity = (double) intersection.size() / 
                    Math.max(projectSkills.size(), targetSkills.size());
            
            maxSimilarity = Math.max(maxSimilarity, similarity);
        }

        return maxSimilarity;
    }

    /**
     * Extracts skill IDs from a list of projects.
     * 
     * @param projects list of projects
     * @return map of project ID to set of skill IDs
     */
    public Map<Long, Set<Long>> extractProjectSkills(List<Project> projects) {
        Map<Long, Set<Long>> projectSkills = new HashMap<>();
        
        if (projects == null) {
            return projectSkills;
        }

        for (Project project : projects) {
            if (project != null && project.getId() != null && project.getSkills() != null) {
                Set<Long> skillIds = project.getSkills().stream()
                        .map(Skill::getId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());
                projectSkills.put(project.getId(), skillIds);
            }
        }

        return projectSkills;
    }

    /**
     * Calculates similarity scores for a list of projects and sorts them by similarity.
     * 
     * @param projects list of projects to calculate similarity for
     * @param targetProjectSkills map of target project IDs to their skill IDs
     * @return list of projects with their similarity scores, sorted by similarity (highest first)
     */
    public List<ProjectSimilarityResult> calculateAndSortSimilarities(
            List<Project> projects,
            Map<Long, Set<Long>> targetProjectSkills) {
        
        if (projects == null || projects.isEmpty() || targetProjectSkills == null || targetProjectSkills.isEmpty()) {
            return Collections.emptyList();
        }

        return projects.stream()
                .filter(Objects::nonNull)
                .map(project -> {
                    double similarity = calculateMaxSimilarity(project, targetProjectSkills);
                    return new ProjectSimilarityResult(project, similarity);
                })
                .filter(result -> result.getSimilarity() > 0)
                .sorted((r1, r2) -> Double.compare(r2.getSimilarity(), r1.getSimilarity()))
                .collect(Collectors.toList());
    }

    /**
     * Result class containing project and its similarity score.
     */
    public static class ProjectSimilarityResult {
        private final Project project;
        private final double similarity;

        public ProjectSimilarityResult(Project project, double similarity) {
            this.project = project;
            this.similarity = similarity;
        }

        public Project getProject() {
            return project;
        }

        public double getSimilarity() {
            return similarity;
        }
    }
}
