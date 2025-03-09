import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define the testSchema here (or import it from a shared file)
const testSchema = z.object({
  patientName: z.string(),
  testType: z.string(),
  result: z.string(),
  testDate: z.string().datetime(), // Ensure this matches the schema in index.ts
  notes: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const test = await prisma.diagnosticTest.findUnique({
      where: { id: String(id) },  // Cast the id to a string
    });
    
    if (test) {
      res.status(200).json(test);
    } else {
      res.status(404).json({ error: 'Test not found' });
    }
  } else if (req.method === 'PUT') {
    try {
      const data = testSchema.parse(req.body); // Validate the request body
      const updatedTest = await prisma.diagnosticTest.update({
        where:  { id: String(id) },
        data,
      });
      res.status(200).json(updatedTest);
    } catch (error) {
      res.status(400).json({ error: 'Invalid data' });
    }
  } else if (req.method === 'DELETE') {
    await prisma.diagnosticTest.delete({ where: { id: String(id) } });
    res.status(204).end();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}