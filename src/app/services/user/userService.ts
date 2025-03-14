import { connectDB } from "@/app/services/database/database";
import { UserModel, IUser } from "@/models/user_model";

async function getAllUsers() {
  console.log("Fetching all users.");
  
  await connectDB().then(
    () => console.log("Successfully connected to the database.")
  ).catch(
    () => console.log("There was an error with connecting to the database.")
  )

  let results = await UserModel.find();

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

export {
  getAllUsers,
  createUser,
  editUser
};