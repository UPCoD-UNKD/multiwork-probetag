package com.multiworkbackend;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Main Spring Boot application class.
 * 
 * Note: We use Redis only for caching (Spring Cache abstraction),
 * not for Redis repositories. Redis repository scanning is disabled via
 * spring.data.redis.repositories.enabled=false in application.properties
 * to avoid conflicts with JPA repositories.
 */
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.multiworkbackend.repo")
@OpenAPIDefinition
public class MultiworkBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MultiworkBackendApplication.class, args);
	}
}
