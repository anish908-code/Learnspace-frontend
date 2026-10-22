import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Bell, CheckCheck } from "lucide-react";

import {
    fetchNotifications,
    markNotificationRead,
    clearAllNotifications,
    clearNotificationError,
} from "../../features/student/notificationSlice";
import { SkeletonList } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner, EmptyState } from "../../components/common";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { cn } from "../../utils/cn";

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
                <PageHeader eyebrow="activity feed" title="Notifications" />

                <SkeletonList count={5} />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                eyebrow="activity feed"
                title="Notifications"
                subtitle={`Total ${notifications.length} notification(s).`}
                action={
                    notifications.length > 0 ? (
                        <Button
                            type="button"
                            onClick={() => dispatch(clearAllNotifications())}
                            variant="secondary"
                            size="sm"
                            disabled={loading}
                        >
                            Clear All Notifications
                        </Button>
                    ) : null
                }
            />

            {error && <AlertBanner type="error" message={error} />}

            {notifications.length === 0 ? (
                <EmptyState icon={Bell} title="No notifications yet." />
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <article
                            key={notification.id}
                            className={cn(
                                "data-row items-start gap-3.5 p-4 sm:gap-4 sm:p-5",
                                !notification.is_read && "border-accent/40 bg-accent/8",
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                    notification.is_read ? "bg-line-strong" : "bg-accent",
                                )}
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    <h2
                                        className={cn(
                                            "break-words font-display text-sm font-bold",
                                            notification.is_read ? "text-muted" : "text-fg",
                                        )}
                                    >
                                        {notification.title}
                                    </h2>

                                    {!notification.is_read && (
                                        <Badge tone="accent" dot>
                                            Unread
                                        </Badge>
                                    )}
                                </div>

                                <p className="mt-1.5 break-words text-sm leading-relaxed text-muted">
                                    {notification.message}
                                </p>

                                <p className="technical-label mt-2.5">
                                    Type: {notification.type || "-"}
                                </p>
                            </div>

                            {!notification.is_read && (
                                <Button
                                    type="button"
                                    onClick={() => dispatch(markNotificationRead(notification.id))}
                                    variant="secondary"
                                    size="sm"
                                    className="shrink-0"
                                    aria-label={`Mark as Read: ${notification.title}`}
                                >
                                    <CheckCheck size={14} />
                                    Mark as Read
                                </Button>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
