import Router from "koa-router";
import { Firestore } from "../server";

const contactController = new Router({
  prefix: "/contact",
});

contactController.post("/create", async (context) => {
  const { firstName, lastName, phoneNumber, address } = context.request
    .body as {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  };
  const { email: currentUserEmail } = (
    context.state as { user: { email: string } }
  ).user; // Get current user id from JWT token

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
  context.body = {
    id: response.id,
    firstName,
    lastName,
    phoneNumber,
    address,
  };
});

export { contactController };
