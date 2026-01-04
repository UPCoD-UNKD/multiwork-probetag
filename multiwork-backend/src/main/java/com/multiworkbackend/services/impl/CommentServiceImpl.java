package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.CommentDTO;
import com.multiworkbackend.entity.Comment;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.mapper.CommentMapper;
import com.multiworkbackend.repo.CommentRepo;
import com.multiworkbackend.services.CommentService;
import com.multiworkbackend.util.validation.DataSizeValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@RequiredArgsConstructor
@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepo commentRepo;
    private final CommentMapper commentMapper;
    private final DataSizeValidator dataSizeValidator;
    
    @Override
    @Transactional(readOnly = true)
    public CommentDTO getComment(Long id) throws NoSuchElementFoundException {
        Comment comment = commentRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementFoundException("Comment not found with id: " + id));
        return commentMapper.toDTO(comment);
    }
    
    @Override
    @Transactional
    public CommentDTO createComment(CommentDTO commentDTO) {
        Comment saved = createCommentEntity(commentDTO);
        return commentMapper.toDTO(saved);
    }
    
    @Override
    @Transactional
    public Comment createCommentEntity(CommentDTO commentDTO) {
        if (commentDTO.getText() != null) {
            dataSizeValidator.validateCommentTextLength(commentDTO.getText());
        }
        
        Comment comment = commentMapper.toEntity(commentDTO);
        
        if (comment.getDate() == null) {
            comment.setDate(LocalDate.now());
        }
        if (comment.getTime() == null) {
            comment.setTime(LocalTime.now());
        }
        
        return commentRepo.save(comment);
    }
}
