package com.multiworkbackend.controllers;


import com.multiworkbackend.dto.CommentDTO;
import com.multiworkbackend.services.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{id}")
    public ResponseEntity<Object> getComment(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getComment(id));
    }

    @PostMapping("/")
    public ResponseEntity<Object> createComment(@RequestBody @Valid CommentDTO comment) {
        return ResponseEntity.ok(commentService.createComment(comment));
    }
}
