package com.multiworkbackend.services.impl;

import com.multiworkbackend.entity.User;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.repo.UserRepo;
import com.multiworkbackend.services.UserEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Implementation of UserEntityService for internal user entity operations.
 */
@Service
@RequiredArgsConstructor
public class UserEntityServiceImpl implements UserEntityService {

    private final UserRepo userRepo;

    @Override
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) throws NoSuchElementFoundException {
        return userRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementFoundException("User Not Found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserByUsernameOptional(String username) {
        return userRepo.findByUsername(username);
    }
}
