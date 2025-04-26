
interface NotificationParams {
    type: string;
    entity: any;
    entityName?: string;
    action?: 'created' | 'updated' | 'deleted';
    customMessage?: string;
    sendAll?: boolean;
    userId?: string;
}

export async function createNotification({ type, entity, entityName, action, customMessage, sendAll, userId }: NotificationParams): Promise<void> {
    let message = customMessage;
    
    if (!customMessage) {
        // Default message templates based on type and action
        switch (type) {
            case 'event':
                message = `A new event "${entity.name}" has been ${action}. Check it out!`;
                break;
            case 'announcement':
                message = `A new announcement "${entityName}" has been ${action}. Stay updated!`;
                break;
            case 'donation':
                message = `A new donation campaign "${entityName}" has been ${action}. Support us!`;
                break;
            case 'job':
                message = `A new job posting "${entity.title}" in ${entity.company} has been ${action}. Apply now!`;
                break;
            default:
                message = `${entityName} has been ${action}.`;
        }
    }

    if (sendAll) {
    const response = await fetch('/api/notifications/send-all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type,
            message,
        }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create notification');
    }
    } else {

        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                type,
                message,
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create notification');
        }
    }


} 