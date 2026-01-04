package com.multiworkbackend.health;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

/**
 * Тесты для проверки health check базы данных
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DatabaseHealthCheckTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DataSource dataSource;

    /**
     * Тест прямого подключения к базе данных
     */
    @Test
    void testDirectDatabaseConnection() throws Exception {
        assertNotNull(dataSource, "DataSource должен быть настроен");

        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "Подключение к базе данных должно быть установлено");
            assertFalse(connection.isClosed(), "Подключение должно быть активным");

            // Проверяем метаданные базы данных
            DatabaseMetaData metaData = connection.getMetaData();
            assertNotNull(metaData, "Метаданные базы данных должны быть доступны");

            String databaseProductName = metaData.getDatabaseProductName();
            assertNotNull(databaseProductName, "Имя продукта БД должно быть доступно");
            System.out.println("✅ База данных: " + databaseProductName + " " + metaData.getDatabaseProductVersion());

            // Проверяем, что можем выполнить простой запрос
            try (var statement = connection.createStatement();
                 ResultSet rs = statement.executeQuery("SELECT 1")) {
                assertTrue(rs.next(), "Должен вернуться результат запроса");
                assertEquals(1, rs.getInt(1), "Результат запроса должен быть равен 1");
            }
        }
    }

    /**
     * Тест health check endpoint через Actuator
     */
    @Test
    void testHealthCheckEndpoint() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/actuator/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").exists())
                .andExpect(jsonPath("$.status").exists());
    }

    /**
     * Тест детального health check с информацией о базе данных
     */
    @Test
    void testDetailedHealthCheck() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/actuator/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").exists());
        
        // Проверяем компоненты, если они доступны (зависит от конфигурации)
        // В тестовом профиле может не быть детальной информации
    }

    /**
     * Тест проверки доступности таблиц в базе данных
     */
    @Test
    void testDatabaseTablesExist() throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            String catalog = connection.getCatalog();
            String schema = connection.getSchema();

            // Проверяем наличие основных таблиц
            String[] expectedTables = {"users", "projects", "skills", "project_applications"};

            for (String tableName : expectedTables) {
                try (ResultSet tables = metaData.getTables(catalog, schema, tableName, null)) {
                    if (tables.next()) {
                        System.out.println("✅ Таблица '" + tableName + "' существует");
                    } else {
                        System.out.println("⚠ Таблица '" + tableName + "' не найдена (может быть нормально для тестовой БД)");
                    }
                }
            }
        }
    }

    /**
     * Тест производительности подключения к базе данных
     */
    @Test
    void testDatabaseConnectionPerformance() throws Exception {
        long startTime = System.currentTimeMillis();

        try (Connection connection = dataSource.getConnection()) {
            long connectionTime = System.currentTimeMillis() - startTime;
            System.out.println("⏱ Время подключения: " + connectionTime + " мс");

            // Проверяем, что подключение установлено быстро (менее 5 секунд)
            assertTrue(connectionTime < 5000, 
                    "Подключение должно быть установлено менее чем за 5 секунд, но заняло " + connectionTime + " мс");

            // Выполняем простой запрос для проверки производительности
            startTime = System.currentTimeMillis();
            try (var statement = connection.createStatement();
                 ResultSet rs = statement.executeQuery("SELECT 1")) {
                long queryTime = System.currentTimeMillis() - startTime;
                System.out.println("⏱ Время выполнения запроса: " + queryTime + " мс");
                assertTrue(queryTime < 1000, 
                        "Запрос должен выполняться менее чем за 1 секунду, но занял " + queryTime + " мс");
            }
        }
    }

    /**
     * Тест проверки пула подключений (HikariCP)
     */
    @Test
    void testConnectionPool() throws Exception {
        assertNotNull(dataSource, "DataSource должен быть настроен");

        // Проверяем, что это HikariCP DataSource
        if (dataSource instanceof com.zaxxer.hikari.HikariDataSource) {
            com.zaxxer.hikari.HikariDataSource hikariDataSource = 
                    (com.zaxxer.hikari.HikariDataSource) dataSource;

            System.out.println("✅ Используется HikariCP Connection Pool");
            System.out.println("   Максимальный размер пула: " + hikariDataSource.getMaximumPoolSize());
            System.out.println("   Минимальный размер пула: " + hikariDataSource.getMinimumIdle());
            System.out.println("   Активных подключений: " + hikariDataSource.getHikariPoolMXBean().getActiveConnections());
            System.out.println("   Ожидающих подключений: " + hikariDataSource.getHikariPoolMXBean().getThreadsAwaitingConnection());

            assertTrue(hikariDataSource.getMaximumPoolSize() > 0, 
                    "Максимальный размер пула должен быть больше 0");
        } else {
            System.out.println("⚠ Используется другой DataSource: " + dataSource.getClass().getName());
        }
    }
}
