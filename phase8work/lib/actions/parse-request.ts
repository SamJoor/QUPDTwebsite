import { ZodSchema } from 'zod';

export async function parseJsonRequest<T>(request: Request, schema: ZodSchema<T>) {
  const json = await request.json();
  return schema.safeParse(json);
}
