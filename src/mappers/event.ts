import { Event } from "@/entities/event";
import { EventDto } from "@/models/event";

export function mapEventToEventDto(event: Event): EventDto {
    return {
        _id: event._id,
        name: event.name,
        organizer: event.organizer,
        description: event.description,
        type: event.type,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        imageUrl: event.imageUrl,
        sponsorship: event.sponsorship ? {
            enabled: event.sponsorship.enabled,
            goal: event.sponsorship.goal,
            currentAmount: event.sponsorship.currentAmount,
            sponsors: event.sponsorship.sponsors
        } : undefined,
        rsvp: event.rsvp,
        wouldGo: event.wouldGo,
        wouldNotGo: event.wouldNotGo,
        wouldMaybeGo: event.wouldMaybeGo
    };
}

export function mapEventDtoToEvent(eventDto: EventDto): Event {
    return {
        _id: eventDto._id,
        name: eventDto.name,
        organizer: eventDto.organizer,
        description: eventDto.description,
        type: eventDto.type,
        location: eventDto.location,
        startDate: eventDto.startDate,
        endDate: eventDto.endDate,
        imageUrl: eventDto.imageUrl,
        sponsorship: eventDto.sponsorship ? {
            enabled: eventDto.sponsorship.enabled,
            goal: eventDto.sponsorship.goal || 0,
            currentAmount: eventDto.sponsorship.currentAmount || 0,
            sponsors: eventDto.sponsorship.sponsors || []
        } : undefined,
        rsvp: eventDto.rsvp,
        wouldGo: eventDto.wouldGo || [],
        wouldNotGo: eventDto.wouldNotGo || [],
        wouldMaybeGo: eventDto.wouldMaybeGo || []
    };
}