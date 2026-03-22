package com.smartcampus.repository;

import com.smartcampus.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Resource entity.
 * Module A – Facilities & Assets Catalogue
 */
@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByStatus(Resource.ResourceStatus status);

    List<Resource> findByType(Resource.ResourceType type);

    List<Resource> findByTypeAndStatus(Resource.ResourceType type, Resource.ResourceStatus status);

    List<Resource> findByCapacityGreaterThanEqual(int minCapacity);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    // Search by name or location
    List<Resource> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(String name, String location);
}
