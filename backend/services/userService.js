import User from "../models/userModel.js"

const getUserById = async(id) => await User.findById(id);

const createNewUser = async(body) => await User.create(body);

const deleteUser = async(id) => await User.findByIdAndDelete(id);

const modifyUser = async(id) => {
    const user = await User.findById(id);
    // Then do updates
}



export default {
    findUser: getUserById,
    newUser: createNewUser,
    deleteUser,
    modifyUser
}