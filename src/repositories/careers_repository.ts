import { connectDB } from "@/databases/mongodb";
import { CareerDto, CareerSchema } from "@/models/careers";
import { mapCareerDtoToCareer, mapCareerToCareerDto } from "@/mappers/careers";
import { Careers } from "@/entities/careers";
import { Connection, Model } from "mongoose";

export interface CareerRepository {
  getAllCareers(): Promise<Careers[]>;
  getCareersByAlumniId(alumniId: string): Promise<Careers[]>;
  createCareer(career: Careers): Promise<string>;
  updateCareerByAlumniId(career: Careers): Promise<void>;
  deleteCareerByAlumniId(alumniId: string): Promise<void>;
}

class MongoDBCareerRepository implements CareerRepository {
  private connection: Connection;
  private model: Model<CareerDto>;

  constructor(connection: Connection) {
    this.connection = connection;
    this.model = connection.models["Career"] ?? connection.model("Career", CareerSchema, "careers");
  }

  async getAllCareers(): Promise<Careers[]> {
    const careers = await this.model.find({});
    return careers.map(mapCareerDtoToCareer);
  }

  async getCareersByAlumniId(alumniId: string): Promise<Careers[]> {
    const careers = await this.model.find({ alumniID: alumniId });
    return careers.map(mapCareerDtoToCareer);
  }

  async createCareer(career: Careers): Promise<string> {
    const dto = mapCareerToCareerDto(career);
    const created = await this.model.create(dto);
    return created._id.toString();
  }

  async updateCareerByAlumniId(career: Careers): Promise<void> {
    const dto = mapCareerToCareerDto(career);
    await this.model.findOneAndUpdate({ alumniID: dto.alumniID }, dto, { new: true });
  }

  async deleteCareerByAlumniId(alumniId: string): Promise<void> {
    await this.model.deleteMany({ alumniID: alumniId });
  }
}

let careerRepository: CareerRepository | null = null;

export function getCareerRepository(): CareerRepository {
  if (careerRepository !== null) return careerRepository;

  const connection = connectDB();
  careerRepository = new MongoDBCareerRepository(connection);
  return careerRepository;
}
