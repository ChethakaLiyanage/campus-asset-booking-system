package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for Module E – User management.
 * Also implements UserDetailsService for Spring Security.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    /** Load user by email for Spring Security */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                "", // No password for OAuth2 users
                user.isEnabled(),
                true, true, true,
                authorities
        );
    }

    /** Find or register an OAuth2 user */
    public User findOrCreateOAuth2User(String email, String name, String picture,
                                       String provider, String providerId) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .name(name)
                    .profilePicture(picture)
                    .provider(provider)
                    .providerId(providerId)
                    .roles(Set.of(User.Role.USER))
                    .enabled(true)
                    .build();
            log.info("Registering new OAuth2 user: {}", email);
            return userRepository.save(newUser);
        });
    }

    /** Get user by ID */
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    /** Get all users (Admin only) */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /** Update user roles (Admin only) */
    public User updateUserRoles(String userId, Set<User.Role> roles) {
        User user = getUserById(userId);
        user.setRoles(roles);
        return userRepository.save(user);
    }
}
