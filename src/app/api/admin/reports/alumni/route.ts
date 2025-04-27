import { NextResponse } from "next/server";
import { getUserRepository } from "@/repositories/user_repository";
import { User } from "@/entities/user";

export async function GET(){
    try{
        const userRepository = getUserRepository();
        const alumniList: User[] = await userRepository.getAllAlumni();

        // Alumni per Graduation Year
        const alumniByGradYear: {[key: number]: number} = {};
        for (const alumni of alumniList){
            if(alumni.graduationYear){
                const key = alumni.graduationYear;
                alumniByGradYear[key] = (alumniByGradYear[key] || 0) + 1; 
            }
        }

        const alumniPerGraduationYear = Object.entries(alumniByGradYear).map(([key, count]) => {
            return {
                year: key,
                numOfAlumniPerGradYear: count,
            }
        })

        // Distribution by Field
        const alumniByField: {[key: string]: number} = {};
        for (const alumni of alumniList){
            if(alumni.currentPosition){
                const key = alumni.currentPosition;
                alumniByField[key] = (alumniByField[key] || 0) + 1;
            }
        }

        const distributionByField = Object.entries(alumniByField).map(([key, count]) => {
            return {
                field: key,
                numOfAlumniInField: count
            }
        })
        
        // Monthly Active Alumni Report
        const currentYear = new Date().getFullYear();

        const activeAlumniByMonth: {[key: string]: number} = {};
        for (const alumni of alumniList){
            const lastUpdate = new Date(alumni.updatedAt!);
            if(lastUpdate.getFullYear() === currentYear){
                const month = lastUpdate.getMonth() + 1;
                const year = lastUpdate.getFullYear();
                const key = `${year}-${month.toString().padStart(2,"0")}`;
                activeAlumniByMonth[key] = (activeAlumniByMonth[key] || 0) + 1;
            }
        }

        let cumulativeCount = 0;
        for (let month=1; month<=12; month++){
            const key = `${currentYear}-${month.toString().padStart(2, "0")}`;
            cumulativeCount += activeAlumniByMonth[key] || 0;
            activeAlumniByMonth[key] = cumulativeCount;
        }

        const monthlyActiveAlumni = Object.entries(activeAlumniByMonth).map(([key, count]) => {
            const [year, month] = key.split("-");
            return {
                year: parseInt(year),
                month: parseInt(month),
                numOfActiveAlumni: count,
            };
        })

        return NextResponse.json(
            {
                alumniPerGraduationYear,
                distributionByField,
                monthlyActiveAlumni,
            },
            {status: 200}
        )


    }catch(error){
        console.error("Failed to fetch report data: ", error);
        return NextResponse.json({error: "Failed to generate report."}, {status: 500});
    }
}