import { connectDB } from "@/app/services/database/database";
import { NextRequest, NextResponse } from "next/server";
import { createUser, editUser } from "@/app/services/user/userService";
import { IUser, UserModel } from "@/models/user_model";
import data from "@/dummy_data/user.json"
import { Types } from "mongoose";

// Populate database endpoint
export async function POST(req: NextRequest) {
  console.log("[DEV] Triggered populate database endpoint.");

  

  try {
    await connectDB().catch(
      (error) => {
        console.log("There was an error with connecting to the database.", error)
      }
    );

    let originalLog = console.log();
    (console as any).log = () => {}

    data.forEach(async (element) => {
      let user = element as unknown as IUser;
      user.adviser = new Types.ObjectId(element.adviser["$oid"]);
      user.currentAddress = new Types.ObjectId(element.currentAddress["$oid"]);

      await createUser(user);
    });

    (console as any).log = originalLog;

    return NextResponse.json({
      success: true,
      message: "Successfully populated the database."
    });
    

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "There was an error with populating the database."
    });
  }
}

export async function DELETE(req: NextRequest) {
  console.log("[DEV] Triggered populate database endpoint.");

  

  try {
    await connectDB().catch(
      (error) => {
        console.log("There was an error with connecting to the database.", error)
      }
    );
    
    let originalLog = console.log();
    (console as any).log = () => {}

    data.forEach(async (element) => {
      let user = element as unknown as IUser;
      user.adviser = new Types.ObjectId(element.adviser["$oid"]);
      user.currentAddress = new Types.ObjectId(element.currentAddress["$oid"]);

      await createUser(user);
    });

    (console as any).log = originalLog;

    return NextResponse.json({
      success: true,
      message: "Successfully populated the database."
    });
    

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "There was an error with populating the database."
    });
  }
}