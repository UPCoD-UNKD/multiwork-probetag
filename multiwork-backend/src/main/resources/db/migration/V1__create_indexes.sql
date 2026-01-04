-- ============================================
-- Database Indexes for Performance Optimization
-- ============================================
-- These indexes are critical for handling 1000-2000 concurrent users
-- Run this script after initial schema creation
-- For PostgreSQL, indexes are created automatically by Hibernate
-- This file serves as documentation and can be used for manual index creation

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(date);
CREATE INDEX IF NOT EXISTS idx_projects_position ON projects(position);

-- Project members (many-to-many join table)
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);

-- Project followers (many-to-many join table)
CREATE INDEX IF NOT EXISTS idx_project_followers_project_id ON project_followers(project_id);
CREATE INDEX IF NOT EXISTS idx_project_followers_user_id ON project_followers(user_id);

-- Project skills (many-to-many join table)
CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill_id ON project_skills(skill_id);

-- Project applications - CRITICAL for performance
CREATE INDEX IF NOT EXISTS idx_project_applications_project_id ON project_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_applicant_id ON project_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_status ON project_applications(status);
CREATE INDEX IF NOT EXISTS idx_project_applications_created_at ON project_applications(created_at);

-- Composite index for common query pattern: find applications by project and status
CREATE INDEX IF NOT EXISTS idx_project_applications_project_status ON project_applications(project_id, status);

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_creator_id ON comments(creator_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_date ON comments(comment_date);

-- Users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- User skills (many-to-many join table)
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);

-- Project statuses (element collection)
CREATE INDEX IF NOT EXISTS idx_project_statuses_project_id ON project_project_statuses(project_id);

-- Project types (element collection)
CREATE INDEX IF NOT EXISTS idx_project_types_project_id ON project_project_types(project_id);

-- ============================================
-- Notes:
-- ============================================
-- 1. These indexes will be created automatically by Hibernate in most cases
-- 2. For production, verify indexes exist: \d+ table_name (PostgreSQL)
-- 3. Monitor index usage: SELECT * FROM pg_stat_user_indexes;
-- 4. Consider partial indexes for frequently filtered columns (e.g., status = 'ACTIVE')
-- 5. Update statistics after creating indexes: ANALYZE;
