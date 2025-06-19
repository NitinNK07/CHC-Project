package com.avirat.chc.repo;

import com.avirat.chc.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Integer> {

    Optional<UserEntity> findByUserName(String userName);

    @Query(value = "SELECT * FROM VictusDB.user_info WHERE user_id = ? AND health_card_id = ?", nativeQuery = true)
    Optional<UserEntity> getUserDataForCheck(String userName, Integer healthCardNo);

    // This is the one you want to use:
    Optional<UserEntity> findByHealthCardNo(Integer healthCardNo);

    Optional<UserEntity> findByDoctorRegNo(Long doctorRegNo);
}
