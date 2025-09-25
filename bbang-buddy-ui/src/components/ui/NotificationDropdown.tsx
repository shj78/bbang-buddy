"use client";

import React from "react";
import useNotificationStore from "../../store/useNotificationStore";
import { Box, Typography, Divider, List, ListItem } from "@mui/material";
import NotificationItem from "./NotificationItem";
import EmptyState from "./EmptyState";

const NotificationDropdown = () => {
    const { notifications } = useNotificationStore();

    if (notifications.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: "center" }}>
                <EmptyState
                    type="list"
                    message="알림이 없습니다"
                    description="새로운 알림이 도착하면 여기에 표시됩니다"
                />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 0, borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
                <Typography sx={{ fontWeight: 500, fontSize: "15px" }}>
                    알림
                </Typography>
            </Box>

            <List sx={{ p: 0, maxHeight: 300, overflow: "auto" }}>
                {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                        <ListItem sx={{ px: 1, py: 1 }}>
                            <NotificationItem notification={notification} />
                        </ListItem>
                        {index < notifications.length - 1 && (
                            <Divider
                                sx={{ mx: 2 }}
                                key={`divider-${notification.id}`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

export default NotificationDropdown;
