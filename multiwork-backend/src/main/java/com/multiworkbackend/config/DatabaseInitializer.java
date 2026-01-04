package com.multiworkbackend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Утилита для сброса базы данных в режиме разработки
 * Использование: установите системное свойство -Dreset.db=true при запуске
 */
@Configuration
public class DatabaseInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);

    @Value("${spring.datasource.url:jdbc:h2:file:./data/devdb}")
    private String datasourceUrl;

    @Bean
    @Profile("!prod")
    public CommandLineRunner databaseResetRunner() {
        return args -> {
            String resetDb = System.getProperty("reset.db");
            if ("true".equalsIgnoreCase(resetDb)) {
                resetH2Database();
            }
        };
    }

    private void resetH2Database() {
        try {
            // Извлекаем путь к базе данных из URL
            // Формат: jdbc:h2:file:./data/devdb
            if (datasourceUrl.contains("jdbc:h2:file:")) {
                String dbPath = datasourceUrl.substring("jdbc:h2:file:".length());
                // Убираем параметры после ;
                if (dbPath.contains(";")) {
                    dbPath = dbPath.substring(0, dbPath.indexOf(";"));
                }
                
                // Удаляем файлы базы данных H2
                Path dbFile = Paths.get(dbPath + ".mv.db");
                Path traceFile = Paths.get(dbPath + ".trace.db");
                Path lockFile = Paths.get(dbPath + ".lock.db");
                
                boolean deleted = false;
                if (Files.exists(dbFile)) {
                    Files.delete(dbFile);
                    logger.info("Deleted database file: {}", dbFile);
                    deleted = true;
                }
                if (Files.exists(traceFile)) {
                    Files.delete(traceFile);
                    logger.info("Deleted trace file: {}", traceFile);
                }
                if (Files.exists(lockFile)) {
                    Files.delete(lockFile);
                    logger.info("Deleted lock file: {}", lockFile);
                }
                
                if (deleted) {
                    logger.info("Database reset complete. Hibernate will recreate the database on startup.");
                } else {
                    logger.info("Database files not found. Nothing to reset.");
                }
            }
        } catch (Exception e) {
            logger.error("Error resetting database: {}", e.getMessage(), e);
        }
    }
}
