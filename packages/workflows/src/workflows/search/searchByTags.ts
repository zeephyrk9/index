import { nanoid } from "nanoid";
import { z } from "zod";
import { ProxiedActivities } from "@workflows/activities/proxiedActivities";
import AbstractWorkflowMeta from "@workflows/helpers/AbstractWorkflowMeta";

// Activities
const { search } = ProxiedActivities;

// Inputs and outputs
const Input = z.object({
  query: z.string()
});

const Output = z.string();

/** A workflow that simply calls an activity */
export async function searchByTags(payload: z.infer<typeof Input>): Promise<z.infer<typeof Output>> {
  return await search(payload.query);
}

export const SearchByTagsWorkflowMeta: AbstractWorkflowMeta = {
  path: "/posts/search",
  handler: searchByTags,

  generateWorkflowId: () => (`searchByTags-${ nanoid() }`),

  input: Input,
  output: Output,
};