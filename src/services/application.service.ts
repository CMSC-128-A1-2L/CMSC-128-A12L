import { Application, ApplicationStatus } from "@/entities/application";

export interface CreateApplicationRequest {
    jobId: string;
    coverLetter?: string;
    resumeUrl?: string;
}

export interface UpdateApplicationStatusRequest {
    applicationId: string;
    status: ApplicationStatus;
}

export async function applyForJob(request: CreateApplicationRequest): Promise<{ applicationId: string }> {
    const response = await fetch('/api/alumni/applications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
    }

    return response.json();
}

export async function withdrawApplication(applicationId: string): Promise<void> {
    const response = await fetch(`/api/alumni/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status: ApplicationStatus.WITHDRAWN
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to withdraw application');
    }
}

export async function getUserApplications(): Promise<Application[]> {
    const response = await fetch('/api/alumni/applications');

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch applications');
    }

    return response.json();
}

export async function getJobApplications(jobId: string): Promise<Application[]> {
    const response = await fetch(`/api/alumni/applications/job/${jobId}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch job applications');
    }

    return response.json();
}

export async function updateApplicationStatus(jobId: string, request: UpdateApplicationStatusRequest): Promise<void> {
    const response = await fetch(`/api/alumni/applications/job/${jobId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            applicationId: request.applicationId,
            status: request.status
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update application status');
    }
}

export async function deleteApplication(applicationId: string): Promise<void> {
    const response = await fetch(`/api/alumni/applications/${applicationId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete application');
    }
}