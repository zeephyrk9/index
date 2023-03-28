import { nanoid } from "nanoid";
import { z } from "zod";
import { ProxiedActivities } from "../../activities/proxiedActivities";
import { ContextInstance } from "../../context";
import AbstractWorkflowMeta from "../../helpers/AbstractWorkflowMeta";

// Activities
const { search } = ProxiedActivities;

// Inputs and outputs
const Input = z.object({
  query: z.string()
});

const Output = z.string();

/** A workflow that simply calls an activity */
export async function searchByTags(payload: z.infer<typeof Input>): Promise<z.infer<typeof Output>> {
  console.log("Search by tags!");
  console.log("context:", ContextInstance);
  return await search(payload.query);
}

export const SearchByTagsWorkflowMeta: AbstractWorkflowMeta = {
  path: "/posts/search",
  handler: searchByTags,

  generateWorkflowId: () => (`searchByTags-${ nanoid() }`),

  input: Input,
  output: Output,
};