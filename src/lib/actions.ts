"use server";

import { z } from "zod";
import { ContactFormSchema } from "./schemas";

type ContactFormInputs = z.infer<typeof ContactFormSchema>;

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data);

  if (result.error) {
    return { error: result.error.format() };
  }

  try {
    const { name, email, message } = result.data;

    const response = await fetch("https://formspree.io/f/xojrnyld", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Formspree Error:", errorData);
      return { error: errorData?.error || "Failed to send message" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Catch Block Error:", error);
    return { error: error?.message || "An unexpected error occurred" };
  }
}

