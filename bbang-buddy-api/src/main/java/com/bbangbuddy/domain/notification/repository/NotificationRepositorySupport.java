package com.bbangbuddy.domain.notification.repository;

import java.util.List;

/**
 * @PackageName : com.bbangbuddy.domain.notification.repository
 * @FileName : NotificationRepositorySupport
 * @Author : hjsim
 * @Date : 2025-07-21
 * @Description :  <br>
 */
public interface NotificationRepositorySupport {
    List<String> findUserIdsByPotId(String potId);
}
