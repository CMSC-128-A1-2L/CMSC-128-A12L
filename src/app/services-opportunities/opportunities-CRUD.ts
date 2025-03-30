import { connectDB } from "../../app/services/database/database";
import Opportunities from "../../models/opportunities_model";
import mongoose from "mongoose";


async function getAllOpportunities() {
    console.log("Fetching all Opportunities.");
    
    await connectDB().then(
      () => console.log("Successfully connected to the database.")
    ).catch(
      (error) => console.log("Error connecting to the database:", error)
    );
  
    try {
      let results = await Opportunities.find();
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.log("Error fetching Opportunities:", error);
      return {
        success: false,
        data: error
      };
    }
  }

async function createOpportunity(adminId: string, opportunityData: any) {
  console.log("Creating opportunity with adminId:", adminId);
  
  await connectDB().then(
    () => console.log("Successfully connected to the database.")
  ).catch(
    (error) => console.log("Error connecting to the database:", error)
  );

  try {
    const newOpportunity = new Opportunities({ ...opportunityData, alumniID: new mongoose.Types.ObjectId(adminId) });
    let savedOpportunity = await newOpportunity.save();
    return {
      success: true,
      data: savedOpportunity
    };
  } catch (error) {
    console.log("Error creating opportunity:", error);
    return {
      success: false,
      data: error
    };
  }
}

async function updateOpportunity(opportunityID: string, opportunityData: any) {
    console.log("Updating opportunity with id:", opportunityData);
    
    await connectDB().then(
      () => console.log("Successfully connected to the database.")
    ).catch(
      (error) => console.log("Error connecting to the database:", error)
    );
  
    try {
      let updatedOpportunity = await Opportunities.findByIdAndUpdate(opportunityID, opportunityData, { new: true });
      return {
        success: true,
        data: updatedOpportunity
      };
    } catch (error) {
      console.log("Error updating address:", error);
      return {
        success: false,
        data: error
      };
    }
  }

  async function deleteOpportunity(opportunityID: string) {
    console.log("Deleting opportunity with ID:", opportunityID);
  
    await connectDB().then(
      () => console.log("Successfully connected to the database.")
    ).catch(
      (error) => console.log("Error connecting to the database:", error)
    );
  
    try {
      if (!mongoose.Types.ObjectId.isValid(opportunityID)) {
        return {
          success: false,
          message: "Invalid opportunityID",
        };
      }
  
      let deletedOpportunities = await Opportunities.deleteOne({ _id: new mongoose.Types.ObjectId(opportunityID) });
  
      if (deletedOpportunities.deletedCount === 0) {
        return {
          success: false,
          message: "Opportunity not found",
        };
      }
  
      return {
        success: true,
        message: "Opportunity successfully deleted",
        data: deletedOpportunities
      };
    } catch (error) {
      console.log("Error deleting opportunity:", error);
      return {
        success: false,
        message: "Error deleting opportunity",
        data: error
      };
    }
  }

  async function getSpecificOpportunity(opportunityID: string) {
    console.log("Fetching opportunities with foreignId:", opportunityID);
    
    await connectDB().then(
      () => console.log("Successfully connected to the database.")
    ).catch(
      (error) => console.log("Error connecting to the database:", error)
    );
  
    try {
      let results = await Opportunities.find({ alumniID: new mongoose.Types.ObjectId(opportunityID) });
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.log("Error fetching opportunity:", error);
      return {
        success: false,
        data: error
      };
    }
  }
  

export { getAllOpportunities, createOpportunity, updateOpportunity , deleteOpportunity, getSpecificOpportunity};