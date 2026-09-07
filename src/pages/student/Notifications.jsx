import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchNotifications,
    markNotificationRead,
    clearAllNotifications,
    clearNotificationError,
} from "../../features/student/notificationSlice";
import { SkeletonList } from "../../components/common/Skeleton";

const Notifications = () => {
    const dispatch = useDispatch();
    const { notifications, loading, error } = useSelector((state) => state.studentNotifications);

    useEffect(() => {
        dispatch(fetchNotifications());
        return () => { dispatch(clearNotificationError()); };
    }, [dispatch]);

    if (loading) {
        return (
            <div>
                <div className="mb-6"><h1 className="page-title">Notifications</h1></div>
                <SkeletonList count={5} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="page-title">Notifications</h1>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Total {notifications.length} notification(s).</p>
            </div>

            {notifications.length > 0 && (
                <button
                    type="button"
                    onClick={() => dispatch(clearAllNotifications())}
                    disabled={loading}
                    className="btn-secondary mb-5 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Clear All Notifications
                </button>
            )}

            {error && <div className="mb-5 rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{error}</div>}

            {notifications.length === 0 ? (
                <div className="card p-8 text-center"><p style={{ color: "var(--muted-foreground)" }}>No notifications yet.</p></div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="card p-5"
                            style={!notification.is_read ? { borderTop: "2px solid var(--accent)" } : {}}
                        >
                            <div className="flex items-start justify-between gap-4">
<div className="min-w-0 break-words">
                                    <h2 className="font-medium" style={{ color: "var(--foreground)" }}>
                                        {notification.title}
                                        {!notification.is_read && <span className="ml-2 inline-block h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />}
                                    </h2>
                                    <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{notification.message}</p>
                                    <p className="mt-2 text-xs" style={{ fontFamily: '"IBM Plex Mono", monospace', color: "var(--muted-foreground)" }}>Type: {notification.type || "-"}</p>
                                </div>
                                {!notification.is_read && (
                                    <button type="button" onClick={() => dispatch(markNotificationRead(notification.id))} className="btn-secondary shrink-0 text-xs">
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
