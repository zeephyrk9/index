import { z } from "zod";
import { ProxiedActivities } from "@workflows/activities/proxiedActivities";

// Activities
const { search } = ProxiedActivities;

// Inputs and outputs
const Input = z.object({
  query: z.string()
});

const Output = z.any();

export async function searchByTags(payload: z.infer<typeof Input>): Promise<z.infer<typeof Output>> {
  Input.parse(payload);
  
  return await search(payload.query);
}