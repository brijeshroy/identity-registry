import { UserCategory, UserCategoryKey } from "../constants/project-constants";

export const idCreator = (userCategory:UserCategoryKey) : string =>{
    console.log('User is of type  ',userCategory)
    const currentMoment = new Date().toISOString();
    console.log(currentMoment)
    const currentDate = currentMoment.split("T")[0]!.replaceAll("-","")
    const currentTime = currentMoment.split("T")[1]!.slice(0,7).replaceAll(":","")
   
    console.log("The Current Data is ",currentDate)
    console.log("the current time is",currentTime)
    const userId : string = userCategory.toLowerCase().concat(`_${currentDate}_${currentTime}`);

    console.log(`The user id is ${userId}`);

    return userId;
}