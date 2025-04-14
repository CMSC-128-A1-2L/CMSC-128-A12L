// pages/api/alumni/jobPostings.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getOpportunityRepository } from '@/repositories/opportunity_repository';
import { Opportunity } from '@/entities/opportunity';
import { UserRole } from '@/entities/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const opportunityRepo = getOpportunityRepository();
  
  // Check if user is authenticated and is an alumni
  if (!session || !session.user.role.includes(UserRole.ALUMNI)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = session.user.id;

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          await getJobPosting(req, res, opportunityRepo, userId);
        } else {
          await getAllJobPostings(req, res, opportunityRepo);
        }
        break;
      case 'POST':
        await createJobPosting(req, res, opportunityRepo, userId);
        break;
      case 'PUT':
        await updateJobPosting(req, res, opportunityRepo, userId);
        break;
      case 'DELETE':
        await deleteJobPosting(req, res, opportunityRepo, userId);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get all job postings
async function getAllJobPostings(
  req: NextApiRequest,
  res: NextApiResponse,
  repo: ReturnType<typeof getOpportunityRepository>
) {
  const opportunities = await repo.getAllOpportunities();
  res.status(200).json(opportunities);
}

// Get specific job posting
async function getJobPosting(
  req: NextApiRequest,
  res: NextApiResponse,
  repo: ReturnType<typeof getOpportunityRepository>,
  userId: string
) {
  const opportunity = await repo.getOpportunityById(req.query.id as string);
  
  if (!opportunity) {
    return res.status(404).json({ message: 'Job posting not found' });
  }
  
  res.status(200).json(opportunity);
}

// Create new job posting
async function createJobPosting(
  req: NextApiRequest,
  res: NextApiResponse,
  repo: ReturnType<typeof getOpportunityRepository>,
  userId: string
) {
  const { title, description, position, company, location, tags, workMode } = req.body;

  if (!title || !description || !position || !company || !location || !workMode) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newOpportunity: Opportunity = {
    userId,
    title,
    description,
    position,
    company,
    location,
    tags: tags || [],
    workMode
  };

  const id = await repo.createOpportunity(newOpportunity);
  res.status(201).json({ ...newOpportunity, _id: id });
}

// Update job posting (only owner's post/s)
async function updateJobPosting(
  req: NextApiRequest,
  res: NextApiResponse,
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
  req: NextApiRequest,
  res: NextApiResponse,
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