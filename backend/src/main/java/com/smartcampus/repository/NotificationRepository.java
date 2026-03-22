package com.smartcampus.repository;

import com.smartcampus.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Notification entity.
 * Module D – Notifications
 */
@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Notification> findByUserIdAndRead(String userId, boolean read);

    long countByUserIdAndRead(String userId, boolean read);

    void deleteByUserId(String userId);
}
