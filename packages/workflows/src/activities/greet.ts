export async function greet(name: string): Promise<string> {
    throw new Error("Error!!!");
    return `Hello, ${name}!`;
}