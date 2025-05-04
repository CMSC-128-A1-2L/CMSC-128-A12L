import { connectDB } from "@/databases/mongodb";
import { Event } from "@/entities/event";
import { User } from "@/entities/user";
import { mapEventDtoToEvent, mapEventToEventDto } from "@/mappers/event";
import { mapUserDtoToUser } from "@/mappers/user";
import { EventDto, EventSchema } from "@/models/event";
import { Connection, Model } from "mongoose";


export type RSVPType = "wouldGo" | "wouldMaybeGo" | "wouldNotGo";

/**
 * A repository for managing events.
 */
export interface EventRepository {
    /**
     * Creates a new event in the repository.
     * 
     * @param event The event to create.
     * @returns A promise that resolves when the event is created successfully.
     */
    createEvent(event: Event): Promise<string>;

    /**
     * Gets an event by its ID.
     * 
     * @param id The MongoDB _id of the event to fetch.
     * @returns A promise that resolves to either the fetched event or null if not found.
     */
    getEventById(id: string): Promise<Event | null>;

    /**
     * Gets all events in the repository.
     * 
     * @returns A promise that resolves to an array of all events.
     */
    getAllEvents(): Promise<Event[]>;

    /**
     * Updates an existing event in the repository.
     * 
     * @param event The event to update.
     * @returns A promise that resolves when the event is updated successfully.
     */
    updateEvent(event: Event): Promise<void>;

    /**
     * Deletes an event from the repository.
     * 
     * @param id The ID of the event to delete.
     * @returns A promise that resolves when the event is deleted successfully.
     */
    deleteEvent(id: string): Promise<void>;

    /**
     * * NEW: Adds userID to the wouldGo field of an event from the repository.
     * 
     * @param eId The ID of the event to update.
     * @param uId The ID of the user to enlist to the wouldGo.
     * @returns A promise that resolves when the event is updated successfully.
     */
    addToEventWGo(eId: string, uId: string): Promise<void>

    /**
     * * NEW: Removes userID from the wouldGo field of an event from the repository.
     * 
     * @param eId The ID of the event to update.
     * @param uId The ID of the user to remove from the wouldGo.
     * @returns A promise that resolves when the event is updated successfully.
     */
    deleteFromEventWGo(eId: string, uId: string): Promise<void>

    /**
     * * NEW: Adds userID to the wouldNotGo field of an event from the repository.
     * 
     * @param eId The ID of the event to update.
     * @param uId The ID of the user to enlist to the wouldNotGo.
     * @returns A promise that resolves when the event is updated successfully.
     */
    addToEventWNotGo(eId: string, uId: string): Promise<void>

    /**
     * * NEW: Removes userID from the wouldNotGo field of an event from the repository.
     * 
     * @param eId The ID of the event to update.
     * @param uId The ID of the user to remove from the wouldNotGo.
     * @returns A promise that resolves when the event is updated successfully.
     */
    deleteFromEventWNotGo(eId: string, uId: string): Promise<void>

    /**
     * * NEW: Adds userID to the wouldMaybeGo field of an event from the repository.
     * 
     * @param eId The ID of the event to update.
     * @param uId The ID of the user to enlist to the wouldMaybeGo.
     * @returns A promise that resolves when the event is updated successfully.
     */
    addToEventWMaybeGo(eId: string, uId: string): Promise<void>

    /**
     * * NEW: Removes userID from the wouldMaybeGo field of an event from the repository.
     * 
     * @param eId The ID of the event to update.
     * @param uId The ID of the user to remove from the wouldMaybeGo.
     * @returns A promise that resolves when the event is updated successfully.
     */
    deleteFromEventWMaybeGo(eId: string, uId: string): Promise<void>

    /**
     * Updates the sponsorship contribution for an event
     * @param eventId The ID of the event to update
     * @param contributionAmount The amount to add to current sponsorship
     * @returns A promise that resolves when the contribution is updated
     */
    updateSponsorshipContribution(eventId: string, contributionAmount: number): Promise<void>;

    /*
     * Gets the attendees of an event based on RSVP type.
     * 
     * @param eventId The ID of the event to fetch attendees for.
     * @param rsvpType The RSVP type to filter attendees by.
     * @param userId Optional user ID to filter by.
     * @returns A promise that resolves to an array of users who match the criteria.
     */
    getEventAttendees(eventId: string, rsvpType: RSVPType, userId?: string | null): Promise<User[]>;
}

class MongoDBEventRepository implements EventRepository {
    private connection: Connection;
    private model: Model<EventDto>;

    async createEvent(event: Event): Promise<string> {
        const eventDto = mapEventToEventDto(event);
        const created = await this.model.create(eventDto);
        return created._id.toString();
    }

    async getEventById(id: string): Promise<Event | null> {
        const eventDto = await this.model.findById(id);
        return eventDto ? mapEventDtoToEvent(eventDto) : null;
    }

    async getAllEvents(): Promise<Event[]> {
        const eventDtos = await this.model.find();
        return eventDtos.map(mapEventDtoToEvent);
    }

    async updateEvent(event: Event): Promise<void> {
        const eventDto = mapEventToEventDto(event);
        await this.model.findByIdAndUpdate(event._id, eventDto);
    }

    async deleteEvent(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }
    // * NEW
    async addToEventWGo(eId: string, uId: string): Promise<void> {
        await this.model.findByIdAndUpdate(eId, { $addToSet: {wouldGo: uId}});
    }

    // * NEW
    async deleteFromEventWGo(eId: string, uId: string): Promise<void> {
        await this.model.findByIdAndUpdate(eId, { $pull: {wouldGo: uId}});
    }

    // * NEW
    async addToEventWNotGo(eId: string, uId: string): Promise<void> {
        await this.model.findByIdAndUpdate(eId, { $addToSet: {wouldNotGo: uId}});
    }

    // * NEW
    async deleteFromEventWNotGo(eId: string, uId: string): Promise<void> {
        await this.model.findByIdAndUpdate(eId, { $pull: {wouldNotGo: uId}});
    }

    // * NEW
    async addToEventWMaybeGo(eId: string, uId: string): Promise<void> {
        await this.model.findByIdAndUpdate(eId, { $addToSet: {wouldMaybeGo: uId}});
    }

    // * NEW
    async deleteFromEventWMaybeGo(eId: string, uId: string): Promise<void> {
        await this.model.findByIdAndUpdate(eId, { $pull: {wouldMaybeGo: uId}});
    }

    async updateSponsorshipContribution(eventId: string, contributionAmount: number): Promise<void> {
        const event = await this.model.findById(eventId);
        if (!event) {
            throw new Error('Event not found');
        }

        if (!event.sponsorship?.enabled) {
            throw new Error('Sponsorship is not enabled for this event');
        }

        // Update the current amount
        const currentAmount = event.sponsorship.currentAmount || 0;
        await this.model.findByIdAndUpdate(eventId, {
            'sponsorship.currentAmount': currentAmount + contributionAmount
        });
    }

    async getEventAttendees(eventId: string, rsvpType: RSVPType, userId?: string | null): Promise<User[]> {
        // Find the event and populate the specified RSVP field with user details
        const query = { _id: eventId };
        
        // Use populate to get full user objects
        const eventWithAttendees = await this.model.findOne(query)
            .populate({
                path: rsvpType,
                model: 'User',
                match: userId ? { _id: userId } : {}
            });
        
        if (!eventWithAttendees) {
            return [];
        }
    
        const eventObject = eventWithAttendees.toObject();
        
        // Access the populated field with proper typing
        const attendeesDtos = (eventObject[rsvpType] as any[]) || [];
        
        return attendeesDtos.map(attendeeDto => mapUserDtoToUser(attendeeDto));
    }
  
    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Event"] ?? connection.model("Event", EventSchema, "events");
    }
}

let eventRepository: EventRepository | null = null;

export function getEventRepository(): EventRepository {
    if (eventRepository !== null) {
        return eventRepository;
    }

    const connection = connectDB();
    eventRepository = new MongoDBEventRepository(connection);
    return eventRepository;
}