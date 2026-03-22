package com.smartcampus.service;

import com.smartcampus.dto.ResourceDTO;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Resource;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service Implementation for Module A – Facilities & Assets Catalogue.
 * Implements ResourceServiceInterface for clean architecture.
 *
 * Author: Member 1
 * Handles: CRUD operations + search + filtering
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ResourceService implements ResourceServiceInterface {

    private final ResourceRepository resourceRepository;

    // ====================================================
    // READ
    // ====================================================

    /** Get all resources */
    @Override
    public List<Resource> getAllResources() {
        log.debug("Fetching all resources");
        return resourceRepository.findAll();
    }

    /** Get single resource by ID — throws 404 if not found */
    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resource not found with id: " + id));
    }

    // ====================================================
    // CREATE
    // ====================================================

    /** Create a new resource (Admin only) */
    @Override
    public Resource addResource(ResourceDTO dto) {
        Resource resource = Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .capacity(dto.getCapacity())
                .availableFrom(dto.getAvailableFrom())
                .availableTo(dto.getAvailableTo())
                .status(dto.getStatus() != null ? dto.getStatus() : Resource.ResourceStatus.ACTIVE)
                .features(dto.getFeatures())
                .build();
        log.info("Creating new resource: {}", resource.getName());
        return resourceRepository.save(resource);
    }

    // keep backward-compatible alias used by controller
    public Resource createResource(ResourceDTO dto) {
        return addResource(dto);
    }

    // ====================================================
    // UPDATE
    // ====================================================

    /** Update an existing resource (Admin only) */
    @Override
    public Resource updateResource(String id, ResourceDTO dto) {
        Resource existing = getResourceById(id);
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setDescription(dto.getDescription());
        existing.setLocation(dto.getLocation());
        existing.setCapacity(dto.getCapacity());
        existing.setAvailableFrom(dto.getAvailableFrom());
        existing.setAvailableTo(dto.getAvailableTo());
        if (dto.getStatus() != null) existing.setStatus(dto.getStatus());
        existing.setFeatures(dto.getFeatures());
        log.info("Updating resource: {}", id);
        return resourceRepository.save(existing);
    }

    // ====================================================
    // DELETE
    // ====================================================

    /** Delete a resource (Admin only) */
    @Override
    public void deleteResource(String id) {
        Resource existing = getResourceById(id);
        log.info("Deleting resource: {}", id);
        resourceRepository.delete(existing);
    }

    // ====================================================
    // SEARCH & FILTER
    // ====================================================

    /**
     * Keyword search — searches name OR location (case-insensitive).
     * Used by GET /api/resources/search?keyword=xxx
     */
    @Override
    public List<Resource> searchResources(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return resourceRepository.findAll();
        }
        return resourceRepository
                .findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(keyword, keyword);
    }

    /**
     * Advanced filter — by type, capacity, location, status.
     * Used by GET /api/resources?type=&minCapacity=&location=&status=
     */
    @Override
    public List<Resource> filterResources(Resource.ResourceType type,
                                          Integer minCapacity,
                                          String location,
                                          Resource.ResourceStatus status) {
        if (type != null && status != null) {
            return resourceRepository.findByTypeAndStatus(type, status);
        }
        if (type != null) {
            return resourceRepository.findByType(type);
        }
        if (minCapacity != null) {
            return resourceRepository.findByCapacityGreaterThanEqual(minCapacity);
        }
        if (location != null && !location.isBlank()) {
            return resourceRepository.findByLocationContainingIgnoreCase(location);
        }
        if (status != null) {
            return resourceRepository.findByStatus(status);
        }
        return resourceRepository.findAll();
    }

    // keep old method signature for existing controller calls
    public List<Resource> searchResources(Resource.ResourceType type,
                                          Integer minCapacity,
                                          String location,
                                          Resource.ResourceStatus status) {
        return filterResources(type, minCapacity, location, status);
    }
}
