package com.eridanimelo.application.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eridanimelo.application.app.model.Avatar;
import com.eridanimelo.application.app.model.util.dto.AvatarDTO;

public interface AvatarRepository extends AbstractRepository<Avatar, Long> {

        @Query("SELECT a FROM Avatar a WHERE a.user.id = :userId")
        Optional<Avatar> findByUserId(@Param("userId") Long userId);

        @Query("""
                        SELECT new com.eridanimelo.application.app.model.util.dto.AvatarDTO(a.id, a.upload, a.tipo)
                                FROM Avatar a  INNER JOIN a.user u
                                WHERE u.id = :userId

                        """)
        AvatarDTO findAvatarDTOByUserId(@Param("userId") Long userId);

        @Query("""
                        SELECT new com.eridanimelo.application.app.model.util.dto.AvatarDTO(a.id, a.upload, a.tipo, u.id, u.email)
                                FROM Avatar a INNER JOIN a.user u INNER JOIN u.userRoot ur
                                WHERE ur.id = :userRootId
                        """)
        List<AvatarDTO> findAvatarDTOsByUserRootId(@Param("userRootId") Long userRootId);

        @Query("""
                            SELECT a FROM Avatar a INNER JOIN FETCH a.user u INNER JOIN FETCH u.userRoot ur
                            WHERE ur.id = :userRootId
                        """)
        List<Avatar> findAvatarsByUserRootId(@Param("userRootId") Long userRootId);

        @Query(value = """
                            SELECT
                                a.id AS avatarId,
                                a.bytes AS upload,
                                a.tipo AS tipo,
                                u.id AS userId,
                                u.email AS email
                            FROM avatar a
                            JOIN "user" u ON a.user_id = u.id
                            JOIN user_root ur ON u.user_root_id = ur.id
                            WHERE ur.id = :userRootId
                        """, nativeQuery = true)
        List<Object[]> findAvatarDataByUserRootId(@Param("userRootId") Long userRootId);

}
