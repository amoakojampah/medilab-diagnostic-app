import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define Zod Schema (Ensure testDate is a valid ISO string)
const testSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"), // Required with validation
  testType: z.string().min(1, "Test type is required"),       // Required with validation
  result: z.string().min(1, "Result is required"),            // Required with validation
  testDate: z.string().datetime(),                            // Required: ISO 8601 string
  notes: z.string().optional(),                               // Optional field
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Convert `testDate` to a valid ISO string before validation
      if (!req.body.testDate) {
        throw new Error("testDate is required");
      }

      req.body.testDate = new Date(req.body.testDate).toISOString(); // Ensure valid format

      // Validate the request body with Zod
      const data = testSchema.parse(req.body);

      // Create the test record in the database
      const test = await prisma.diagnosticTest.create({
        data: {
          patientName: data.patientName,
          testType: data.testType,
          result: data.result,
          testDate: new Date(data.testDate), // Convert string to Date before saving
          notes: data.notes,
        },
      });

      res.status(201).json(test);
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: 'Invalid data', details: error });
    }
  } else if (req.method === 'GET') {
    try {
      const tests = await prisma.diagnosticTest.findMany();
      res.status(200).json(tests);
    } catch (error) {
      console.error('Error fetching tests:', error);
      res.status(500).json({ error: 'Failed to fetch tests' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
