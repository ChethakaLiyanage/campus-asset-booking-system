package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.User;
import com.smartcampus.security.JwtUtil;
import com.smartcampus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * REST Controller for Module E – Authentication & Authorization.
 * Base URL: /api/auth
 *
 * Endpoints:
 *  GET  /api/auth/me              - Get current authenticated user profile
 *  GET  /api/auth/users           - Get all users (ADMIN)
 *  PUT  /api/auth/users/{id}/roles - Update user roles (ADMIN)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * GET /api/auth/me - Get current user info
     * Called after OAuth2 login to get JWT token
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(ApiResponse.error("Not authenticated", 401));
        }

        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");
        String sub = principal.getAttribute("sub");

        // Find or register user in DB
        User user = userService.findOrCreateOAuth2User(email, name, picture, "google", sub);

        // Generate JWT token for the client
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRoles());

        Map<String, Object> response = Map.of(
                "token", token,
                "user", user
        );
        return ResponseEntity.ok(ApiResponse.success(response, "Authenticated successfully"));
    }

    /**
     * GET /api/auth/users (ADMIN only)
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    /**
     * PUT /api/auth/users/{id}/roles (ADMIN only)
     */
    @PutMapping("/users/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateUserRoles(
            @PathVariable String id,
            @RequestBody Map<String, Set<User.Role>> body) {
        Set<User.Role> roles = body.get("roles");
        User updated = userService.updateUserRoles(id, roles);
        return ResponseEntity.ok(ApiResponse.success(updated, "User roles updated"));
    }
}
