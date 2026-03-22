package com.smartcampus.service;

import com.smartcampus.dto.ResourceDTO;
import com.smartcampus.model.Resource;
import java.util.List;

/**
 * Service Interface for Module A – Facilities & Assets Catalogue.
 * Defines all business operations on Resource entities.
 *
 * Author: Member 1
 */
public interface ResourceServiceInterface {

    /** Get all resources (no filter) */
    List<Resource> getAllResources();

    /** Get resource by its ID */
    Resource getResourceById(String id);

    /** Create a new resource (Admin only) */
    Resource addResource(ResourceDTO dto);

    /** Update an existing resource by ID (Admin only) */
    Resource updateResource(String id, ResourceDTO dto);

    /** Delete a resource by ID (Admin only) */
    void deleteResource(String id);

    /** Search resources by keyword (name or location) */
    List<Resource> searchResources(String keyword);

    /** Filter resources by type, minCapacity, location, status */
    List<Resource> filterResources(Resource.ResourceType type,
                                   Integer minCapacity,
                                   String location,
                                   Resource.ResourceStatus status);
}
