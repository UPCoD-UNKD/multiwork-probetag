package com.multiworkbackend.util;

import com.multiworkbackend.dto.PageResponse;
import org.springframework.data.domain.Page;

import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Utility class for converting Spring Data Page to PageResponse DTO.
 * Follows best practices for pagination response formatting.
 */
public class PageResponseUtil {

    /**
     * Converts Spring Data Page to PageResponse DTO.
     *
     * @param page the Spring Data Page
     * @param <T>  the type of content
     * @return PageResponse DTO
     */
    public static <T> PageResponse<T> toPageResponse(Page<T> page) {
        if (page == null) {
            return null;
        }

        return PageResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }

    /**
     * Converts Spring Data Page to PageResponse DTO with content transformation.
     *
     * @param page        the Spring Data Page
     * @param transformer function to transform page content
     * @param <T>         the source type
     * @param <R>         the target type
     * @return PageResponse DTO with transformed content
     */
    public static <T, R> PageResponse<R> toPageResponse(Page<T> page, Function<T, R> transformer) {
        if (page == null) {
            return null;
        }

        return PageResponse.<R>builder()
                .content(page.getContent().stream()
                        .map(transformer)
                        .collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}
