import { connectDB } from "@/app/services/database/database";
import Address from "@/models/address_model";
import mongoose from "mongoose";

async function getAllAddresses() {
  console.log("Fetching all addresses.");
  
  await connectDB().then(
    () => console.log("Successfully connected to the database.")
  ).catch(
    (error) => console.log("Error connecting to the database:", error)
  );

  try {
    let results = await Address.find();
    return {
      success: true,
      data: results
    };
  } catch (error) {
    console.log("Error fetching addresses:", error);
    return {
      success: false,
      data: error
    };
  }
}

async function createAddressWithAdminId(adminId: string, addressData: any) {
  console.log("Creating address with adminId:", adminId);
  
  await connectDB().then(
    () => console.log("Successfully connected to the database.")
  ).catch(
    (error) => console.log("Error connecting to the database:", error)
  );

  try {
    const newAddress = new Address({ ...addressData, alumniID: new mongoose.Types.ObjectId(adminId) });
    let savedAddress = await newAddress.save();
    return {
      success: true,
      data: savedAddress
    };
  } catch (error) {
    console.log("Error creating address:", error);
    return {
      success: false,
      data: error
    };
  }
}

async function updateAddress(addressId: string, addressData: any) {
    console.log("Updating address with id:", addressId);
    
    await connectDB().then(
      () => console.log("Successfully connected to the database.")
    ).catch(
      (error) => console.log("Error connecting to the database:", error)
    );
  
    try {
      let updatedAddress = await Address.findByIdAndUpdate(addressId, addressData, { new: true });
      return {
        success: true,
        data: updatedAddress
      };
    } catch (error) {
      console.log("Error updating address:", error);
      return {
        success: false,
        data: error
      };
    }
  }

  async function deleteAddressesByForeignId(foreignId: string) {
    console.log("Deleting all addresses with foreignId:", foreignId);
    
    await connectDB().then(
      () => console.log("Successfully connected to the database.")
    ).catch(
      (error) => console.log("Error connecting to the database:", error)
    );
  
    try {
      let deletedAddresses = await Address.deleteMany({ alumniID: new mongoose.Types.ObjectId(foreignId) });
      return {
        success: true,
        data: deletedAddresses
      };
    } catch (error) {
      console.log("Error deleting addresses:", error);
      return {
        success: false,
        data: error
      };
    }
  }

  async function getAddressesByForeignId(foreignId: string) {
    console.log("Fetching addresses with foreignId:", foreignId);
    
    await connectDB().then(
      () => console.log("Successfully connected to the database.")
    ).catch(
      (error) => console.log("Error connecting to the database:", error)
    );
  
    try {
      let results = await Address.find({ alumniID: new mongoose.Types.ObjectId(foreignId) });
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.log("Error fetching addresses:", error);
      return {
        success: false,
        data: error
      };
    }
  }
  

export { getAllAddresses, createAddressWithAdminId, updateAddress , deleteAddressesByForeignId, getAddressesByForeignId};