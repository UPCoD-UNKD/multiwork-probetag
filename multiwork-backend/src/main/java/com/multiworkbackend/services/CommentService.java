package com.multiworkbackend.services;

import com.multiworkbackend.dto.CommentDTO;
import com.multiworkbackend.entity.Comment;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;

public interface CommentService {

    CommentDTO getComment(Long id) throws NoSuchElementFoundException;

    CommentDTO createComment(CommentDTO comment);
    
    /**
     * Creates a comment entity and returns the saved entity.
     * This method is optimized to avoid additional database queries.
     * 
     * @param commentDTO comment data to create
     * @return saved Comment entity
     */
    Comment createCommentEntity(CommentDTO commentDTO);
}
