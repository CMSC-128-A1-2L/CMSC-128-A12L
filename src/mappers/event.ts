import { Event } from "@/entities/event";
import { EventDto } from "@/models/event";

export function mapEventToEventDto(event: Event): EventDto {
    return {
        _id: event._id,
        name: event.name,
        description: event.description,
        type: event.type,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        monetaryValue: event.monetaryValue,
        wouldGo: event.wouldGo,
        wouldNotGo: event.wouldNotGo,
        wouldMaybeGo: event.wouldMaybeGo
    };
}

export function mapEventDtoToEvent(eventDto: EventDto): Event {
    return {
        _id: eventDto._id,
        name: eventDto.name,
        description: eventDto.description,
        type: eventDto.type,
        location: eventDto.location,
        startDate: eventDto.startDate,
        endDate: eventDto.endDate,
        monetaryValue: eventDto.monetaryValue,
        wouldGo: eventDto.wouldGo,
        wouldNotGo: eventDto.wouldNotGo,
        wouldMaybeGo: eventDto.wouldMaybeGo
    };
} 