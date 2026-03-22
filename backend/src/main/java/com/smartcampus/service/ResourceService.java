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
 * Service for Module A – Facilities & Assets Catalogue.
 * Handles CRUD and search/filter operations on resources.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    /** Get all resources */
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    /** Get resource by ID */
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    /** Create a new resource (Admin only) */
    public Resource createResource(ResourceDTO dto) {
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

    /** Update an existing resource (Admin only) */
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

    /** Delete a resource (Admin only) */
    public void deleteResource(String id) {
        Resource existing = getResourceById(id);
        log.info("Deleting resource: {}", id);
        resourceRepository.delete(existing);
    }

    /** Search resources by type, capacity, location */
    public List<Resource> searchResources(Resource.ResourceType type,
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
}
