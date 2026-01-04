package com.multiworkbackend.config;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

/**
 * Test configuration for WebMvcTest to exclude JPA and database dependencies.
 * This configuration prevents Spring from trying to load JPA repositories
 * when using @WebMvcTest slice.
 */
@TestConfiguration
@EnableAutoConfiguration(exclude = {
        DataSourceAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class,
        JpaRepositoriesAutoConfiguration.class,
        TransactionAutoConfiguration.class
})
@ComponentScan(
        basePackages = "com.multiworkbackend",
        excludeFilters = {
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.multiworkbackend\\.repo\\..*"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.multiworkbackend\\.config\\.DatabaseInitializer"),
                @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.multiworkbackend\\.config\\.DataInitializer")
        }
)
public class WebMvcTestConfiguration {
    // Empty configuration class - annotations do the work
}
