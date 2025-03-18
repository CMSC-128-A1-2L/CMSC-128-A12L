import { connectDB } from "@/app/services/database/database";
import { UserModel, IUser, IUserRequest, SortBy } from "@/models/user_model";
import { Admin, ObjectId } from "mongodb";
import { SortOrder } from "mongoose";
import { getToken } from "next-auth/jwt"

async function getAllUsers(filter: IUserRequest) {
  console.log("Fetching all users.");
  
  console.log(filter);

  await connectDB().then(
    () => console.log("Successfully connected to the database.")
  ).catch(
    () => console.log("There was an error with connecting to the database.")
  )

  let skip: number = (filter.amountPerPage as number * filter.page as number) || 0;
  let amountPerPage: number = (filter.amountPerPage as number) || 10;
  let sortOrder = (filter.sortOrder || "asc") as unknown as string;
  let sortBy = filter.sortBy || "name";

  let sortParameters: Record<string, SortOrder> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1
  }

  console.log("Skip, amountperpage", skip, amountPerPage);

  let results = await UserModel.find().skip(skip).limit(amountPerPage).sort(sortParameters);

  return results;
}


async function createUser(user: IUser) {
  console.log("Creating a user.");


  try {
    await connectDB().catch(
      (error) => {
        console.log("There was an error with connecting to the database.", error)
      }
    );
    let created_user = await UserModel.create(user)
    return {
      success: true,
      data: created_user
    }

  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: error
    }
  }
  // console.log(user)
}

async function editUser(id: string, user: IUser) {
  console.log("Editing a user's details.");

  try {

    if (user.email) {       // user should not be able to change email
      return {
        success: false,
        message: "Email cannot be changed once set."
      }
    }

    if (user.studentId) {   // user should not be able to change student id
      return {
        success: false,
        message: "Student ID cannot be changed once set."
      }
    }
    if (user.firstName || user.middleName || user.lastName || user.suffix) {   // user should not be able to change name
      return {
        success: false,
        message: "Name cannot be changed once set."
      }
    }

    await connectDB().catch(
      (error) => {
        console.log("There was an error with connecting to the database.", error)
      }
    );

    let edited_user = await UserModel.findByIdAndUpdate(id, user)
    return {
      success: true,
      data: edited_user
    }

  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: error
    }
  }
}

async function deleteUser(id: string, req: any) {
  console.log("Delete a user details.");

  try {
    await connectDB().catch(
      (error) => {
        console.log("There was an error with connecting to the database.", error)
      }
    );

    // Get token from delete request
    const token = await getToken({ req });
    if (!token) {
      return {
        success: false,
        message: "Unauthorized access detected: No token."
      };
    }

    // Extract user id from token associated with the request
    const authUserId = token.sub;


    let user = await UserModel.findOne({_id: id});
    if (user?.role == "admin" && user.id.toString() === authUserId){      // Compare user id from token with id of user to delete; check if admin 
      return {
        success: false,
        message: "Admins cannot delete themselves."
      }

    }
    let edited_user = await UserModel.deleteOne({_id: id});
    return {
      success: true,
      data: edited_user
    }

  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: error
    }
  }
}

export {
  getAllUsers,
  createUser,
  editUser,
  deleteUser
};