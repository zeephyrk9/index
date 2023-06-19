import { Context } from "@workflows/context";

export async function runSessionableRequest<T>(context: Context, query: string) {
    // Getting session, running this request, closing session and returning
    // response
    const session = context.getDatabaseSession();
    const result = await session.run<T>(query); 

    session.close();

    return result;
};