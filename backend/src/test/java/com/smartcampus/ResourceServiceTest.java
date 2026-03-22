package com.smartcampus;

import com.smartcampus.dto.ResourceDTO;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Resource;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.service.ResourceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit Tests for ResourceService (Module A – Facilities & Assets)
 * Author: Member 1
 */
@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private ResourceService resourceService;

    private Resource sampleResource;
    private ResourceDTO sampleDTO;

    @BeforeEach
    void setUp() {
        sampleResource = Resource.builder()
                .id("res001")
                .name("Lab A101")
                .type(Resource.ResourceType.LAB)
                .location("Block A, Floor 1")
                .capacity(30)
                .status(Resource.ResourceStatus.ACTIVE)
                .description("Computer lab with 30 PCs")
                .availableFrom(LocalTime.of(8, 0))
                .availableTo(LocalTime.of(20, 0))
                .build();

        sampleDTO = new ResourceDTO();
        sampleDTO.setName("Lab A101");
        sampleDTO.setType(Resource.ResourceType.LAB);
        sampleDTO.setLocation("Block A, Floor 1");
        sampleDTO.setCapacity(30);
        sampleDTO.setStatus(Resource.ResourceStatus.ACTIVE);
        sampleDTO.setAvailableFrom(LocalTime.of(8, 0));
        sampleDTO.setAvailableTo(LocalTime.of(20, 0));
    }

    // ===== GET ALL =====
    @Test
    void getAllResources_ShouldReturnList() {
        when(resourceRepository.findAll()).thenReturn(List.of(sampleResource));

        List<Resource> result = resourceService.getAllResources();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Lab A101", result.get(0).getName());
        verify(resourceRepository, times(1)).findAll();
    }

    // ===== GET BY ID =====
    @Test
    void getResourceById_WhenExists_ShouldReturnResource() {
        when(resourceRepository.findById("res001"))
                .thenReturn(Optional.of(sampleResource));

        Resource result = resourceService.getResourceById("res001");

        assertNotNull(result);
        assertEquals("res001", result.getId());
        assertEquals("Lab A101", result.getName());
    }

    @Test
    void getResourceById_WhenNotExists_ShouldThrowException() {
        when(resourceRepository.findById("nonexistent"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> resourceService.getResourceById("nonexistent"));
    }

    // ===== CREATE =====
    @Test
    void createResource_ShouldSaveAndReturn() {
        when(resourceRepository.save(any(Resource.class))).thenReturn(sampleResource);

        Resource result = resourceService.createResource(sampleDTO);

        assertNotNull(result);
        assertEquals("Lab A101", result.getName());
        verify(resourceRepository, times(1)).save(any(Resource.class));
    }

    // ===== UPDATE =====
    @Test
    void updateResource_WhenExists_ShouldUpdate() {
        when(resourceRepository.findById("res001"))
                .thenReturn(Optional.of(sampleResource));
        when(resourceRepository.save(any(Resource.class))).thenReturn(sampleResource);

        sampleDTO.setCapacity(50);
        Resource result = resourceService.updateResource("res001", sampleDTO);

        assertNotNull(result);
        verify(resourceRepository, times(1)).save(any(Resource.class));
    }

    @Test
    void updateResource_WhenNotExists_ShouldThrowException() {
        when(resourceRepository.findById("bad-id"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> resourceService.updateResource("bad-id", sampleDTO));
    }

    // ===== DELETE =====
    @Test
    void deleteResource_WhenExists_ShouldDelete() {
        when(resourceRepository.findById("res001"))
                .thenReturn(Optional.of(sampleResource));
        doNothing().when(resourceRepository).delete(sampleResource);

        assertDoesNotThrow(() -> resourceService.deleteResource("res001"));
        verify(resourceRepository, times(1)).delete(sampleResource);
    }

    @Test
    void deleteResource_WhenNotExists_ShouldThrowException() {
        when(resourceRepository.findById("bad-id"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> resourceService.deleteResource("bad-id"));
    }

    // ===== SEARCH =====
    @Test
    void searchResources_ByLocation_ShouldReturnMatching() {
        when(resourceRepository.findByLocationContainingIgnoreCase("Block A"))
                .thenReturn(List.of(sampleResource));

        List<Resource> result = resourceService.searchResources("Block A");

        assertFalse(result.isEmpty());
        assertEquals("Lab A101", result.get(0).getName());
    }

    // ===== FILTER =====
    @Test
    void filterResources_ByType_ShouldReturnMatchingType() {
        when(resourceRepository.findByType(Resource.ResourceType.LAB))
                .thenReturn(List.of(sampleResource));

        List<Resource> result = resourceService.searchResources(
                Resource.ResourceType.LAB, null, null, null);

        assertEquals(1, result.size());
        assertEquals(Resource.ResourceType.LAB, result.get(0).getType());
    }
}
