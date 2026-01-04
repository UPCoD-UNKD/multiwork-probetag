package com.multiworkbackend.config.security;


import com.multiworkbackend.services.UserEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.multiworkbackend.entity.User;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserEntityService userEntityService;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        // Попытка найти пользователя по email
        User user = userEntityService.getUserByEmail(login)
                .orElseGet(() ->
                        userEntityService.getUserByUsernameOptional(login)
                                .orElseThrow(() ->
                                        new UsernameNotFoundException("User not found with email or username: " + login)
                                )
                );
        return UserDetailsImpl.build(user);
    }
}
