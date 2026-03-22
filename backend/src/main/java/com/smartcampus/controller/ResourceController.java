package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.ResourceDTO;
import com.smartcampus.model.Resource;
import com.smartcampus.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Module A – Facilities & Assets Catalogue.
 * Base URL: /api/resources
 *
 * Member 1 Endpoints:
 *  GET    /api/resources          - Get all resources (with optional filters)
 *  GET    /api/resources/{id}     - Get resource by ID
 *  POST   /api/resources          - Create resource (ADMIN)
 *  PUT    /api/resources/{id}     - Update resource (ADMIN)
 *  DELETE /api/resources/{id}     - Delete resource (ADMIN)
 */
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    /**
     * GET /api/resources
     * Optional query params: type, minCapacity, location, status
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Resource>>> getAllResources(
            @RequestParam(required = false) Resource.ResourceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Resource.ResourceStatus status) {
        List<Resource> resources = resourceService.searchResources(type, minCapacity, location, status);
        return ResponseEntity.ok(ApiResponse.success(resources, "Resources fetched successfully"));
    }

    /**
     * GET /api/resources/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Resource>> getResourceById(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(ApiResponse.success(resource));
    }

    /**
     * POST /api/resources (ADMIN only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Resource>> createResource(@Valid @RequestBody ResourceDTO dto) {
        Resource created = resourceService.createResource(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(created, "Resource created successfully"));
    }

    /**
     * PUT /api/resources/{id} (ADMIN only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Resource>> updateResource(
            @PathVariable String id,
            @Valid @RequestBody ResourceDTO dto) {
        Resource updated = resourceService.updateResource(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Resource updated successfully"));
    }

    /**
     * DELETE /api/resources/{id} (ADMIN only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Resource deleted successfully"));
    }
}
