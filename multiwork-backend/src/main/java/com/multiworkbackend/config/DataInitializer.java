package com.multiworkbackend.config;

import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.enums.Role;
import com.multiworkbackend.repo.SkillRepo;
import com.multiworkbackend.repo.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    @Profile("!azure")  // Отключаем для Azure профиля
    CommandLineRunner createTestUser(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            String username = "ChiffDev";
            String email = "t@test.com";
            String rawPassword = "Test1234";

            // Проверяем, есть ли уже такой пользователь
            if (!userRepo.existsByUsername(username) && !userRepo.existsByEmail(email)) {
                User testUser = User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode(rawPassword)) // шифруем пароль
                        .role(Role.USER)
                        .build();
                userRepo.save(testUser);
                System.out.println("✅ Test user created: " + username + " / " + email);
            } else {
                System.out.println("ℹ️ Test user already exists");
            }
        };
    }

    @Bean
    @Profile("!azure")  // Отключаем для Azure профиля
    CommandLineRunner initializeSkills(SkillRepo skillRepo) {
        return args -> {
            List<Skill> defaultSkills = Arrays.asList(
                new Skill(null, "Coding", "Программирование и разработка", null),
                new Skill(null, "Web Development", "Веб-разработка", null),
                new Skill(null, "Graphics Design", "Графический дизайн", null),
                new Skill(null, "UX/UI Designer", "UX/UI дизайн", null),
                new Skill(null, "Marketing", "Маркетинг", null),
                new Skill(null, "SMM", "Социальные сети и маркетинг", null),
                new Skill(null, "Content Creation", "Создание контента", null),
                new Skill(null, "Copywriting", "Копирайтинг", null),
                new Skill(null, "Video Making", "Видеомонтаж", null),
                new Skill(null, "Photography", "Фотография", null),
                new Skill(null, "Motion Design", "Моушн дизайн", null),
                new Skill(null, "Art", "Искусство", null),
                new Skill(null, "Management", "Менеджмент", null),
                new Skill(null, "Project Management", "Управление проектами", null),
                new Skill(null, "Team Leading", "Руководство командой", null),
                new Skill(null, "Product Management", "Управление продуктом", null),
                new Skill(null, "Product Marketing", "Маркетинг продукта", null),
                new Skill(null, "Brand Management", "Управление брендом", null),
                new Skill(null, "Data Analytics", "Аналитика данных", null),
                new Skill(null, "Data Science", "Наука о данных", null),
                new Skill(null, "Data Cleansing", "Очистка данных", null),
                new Skill(null, "Statistics", "Статистика", null),
                new Skill(null, "Mathematics", "Математика", null),
                new Skill(null, "Finance", "Финансы", null),
                new Skill(null, "Email Marketing", "Email маркетинг", null),
                new Skill(null, "Targeting", "Таргетинг", null),
                new Skill(null, "QA Engineering", "Тестирование ПО", null),
                new Skill(null, "Computer Animation", "Компьютерная анимация", null),
                new Skill(null, "Texture Drawing", "Создание текстур", null),
                new Skill(null, "Dubbing", "Озвучка", null),
                new Skill(null, "3D Design", "3D дизайн", null)
            );

            int createdCount = 0;
            int existingCount = 0;

            for (Skill skill : defaultSkills) {
                Skill existingSkill = skillRepo.findByName(skill.getName());
                if (existingSkill == null) {
                    skillRepo.save(skill);
                    createdCount++;
                } else {
                    existingCount++;
                }
            }

            if (createdCount > 0) {
                System.out.println("✅ Created " + createdCount + " new skills");
            }
            if (existingCount > 0) {
                System.out.println("ℹ️ " + existingCount + " skills already exist");
            }
            if (createdCount == 0 && existingCount == 0) {
                System.out.println("ℹ️ No skills to initialize");
            }
        };
    }
}
