// pages/api/alumni/jobPostings.ts
import { NextRequest, NextResponse } from "next/server";
import { getOpportunityRepository } from "@/repositories/opportunity_repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/entities/user";
import { Opportunity } from "@/entities/opportunity";

export async function GET(request: NextRequest) {
    try {
        // Check alumni authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const opportunityRepository = getOpportunityRepository();
        const opportunities = await opportunityRepository.getAllOpportunities();
        
        return NextResponse.json(opportunities);
    } catch (error) {
        console.error("Failed to fetch opportunities:", error);
        return NextResponse.json(
            { error: "Failed to fetch opportunities" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check alumni authentication
        const session = await getServerSession(authOptions);
        if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const opportunityRepository = getOpportunityRepository();
        const data = await request.json();

        // Validate required fields
        const requiredFields = ["title", "description", "position", "company", "location", "workMode"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new opportunity with alumni's user ID
        const newOpportunity: Opportunity = {
            userId: session.user.id,
            ...data,
            tags: data.tags || []
        };

        const id = await opportunityRepository.createOpportunity(newOpportunity);
        
        return NextResponse.json(
            { ...newOpportunity, _id: id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create opportunity:", error);
        return NextResponse.json(
            { error: "Failed to create opportunity" },
            { status: 500 }
        );
    }
}

// Get specific job posting
async function getJobPosting(
  req: NextRequest,
  res: NextResponse,
  repo: ReturnType<typeof getOpportunityRepository>,
  userId: string
) {
  const opportunity = await repo.getOpportunityById(req.query.id as string);
  
  if (!opportunity) {
    return res.status(404).json({ message: 'Job posting not found' });
  }
  
  res.status(200).json(opportunity);
}

// Update job posting (only owner's post/s)
async function updateJobPosting(
  req: NextRequest,
  res: NextResponse,
  repo: ReturnType<typeof getOpportunityRepository>,
  userId: string
) {
  const { _id, ...updateData } = req.body;

  if (!_id) {
    return res.status(400).json({ message: 'Job posting ID is required' });
  }

  // Verify if user owns this job posting
  const existingPost = await repo.getOpportunityById(_id);
  
  if (!existingPost) {
    return res.status(404).json({ message: 'Job posting not found' });
  }

  if (existingPost.userId !== userId) {
    return res.status(403).json({ message: 'You can only update your own job postings' });
  }

  const updatedOpportunity: Opportunity = {
    ...existingPost,
    ...updateData
  };

  await repo.updateOpportunity(updatedOpportunity);
  res.status(200).json(updatedOpportunity);
}

// Delete job posting (only owner's post/s)
async function deleteJobPosting(
  req: NextRequest,
  res: NextResponse,
  repo: ReturnType<typeof getOpportunityRepository>,
  userId: string
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Job posting ID is required' });
  }

  // Verify if user owns this job posting
  const existingPost = await repo.getOpportunityById(id as string);
  
  if (!existingPost) {
    return res.status(404).json({ message: 'Job posting not found' });
  }

  if (existingPost.userId !== userId) {
    return res.status(403).json({ message: 'You can only delete your own job postings' });
  }

  await repo.deleteOpportunity(id as string);
  res.status(200).json({ message: 'Job posting deleted successfully' });
}