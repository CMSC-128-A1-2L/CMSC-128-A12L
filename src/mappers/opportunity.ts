import { Opportunity } from "@/entities/opportunity";
import { OpportunityDto } from "@/models/opportunity";

export function mapOpportunityDtoToOpportunity(opportunityDto: OpportunityDto): Opportunity {
    return {
        _id: opportunityDto._id,
        userId: opportunityDto.userId,
        title: opportunityDto.title,
        description: opportunityDto.description,
        position: opportunityDto.position,
        company: opportunityDto.company,
        location: opportunityDto.location,
        tags: opportunityDto.tags,
        workMode: opportunityDto.workMode
    };
}

export function mapOpportunityToOpportunityDto(opportunity: Opportunity): OpportunityDto {
    return {
        _id: opportunity._id,
        userId: opportunity.userId,
        title: opportunity.title,
        description: opportunity.description,
        position: opportunity.position,
        company: opportunity.company,
        location: opportunity.location,
        tags: opportunity.tags,
        workMode: opportunity.workMode
    };
} 