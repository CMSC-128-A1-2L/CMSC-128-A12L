import { connectDB } from "@/databases/mongodb";
import { Event } from "@/entities/event";
import { mapEventDtoToEvent, mapEventToEventDto } from "@/mappers/event";
import { EventDto, EventSchema } from "@/models/event";
import { Connection, Model } from "mongoose";

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