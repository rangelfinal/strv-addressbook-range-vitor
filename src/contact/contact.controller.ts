import { Firestore } from "../server";
import Router from "koa-router";

const contactController = new Router({
  prefix: "/contact",
});

contactController.post("/create", async function (context) {
  const { firstName, lastName, phoneNumber, address } = context.body;
  const { email: currentUserEmail } = context.state.user; // Get current user id from JWT token

  // Save data to firebase
  const response = await Firestore.collection("users")
    .doc(currentUserEmail)
    .collection("contacts")
    .add({
      firstName,
      lastName,
      phoneNumber,
      address,
    });

  // Return created contact id
  context.body = { id: response.id };
});

export { contactController };
