import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();



// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create a new user
router.post('/', async (req: Request, res: Response) => {
  const { firebaseUid, email, displayName, photoURL } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        firebaseUid,
        email,
        displayName,
        photoURL,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user", details:  error instanceof Error ? error.message : "An unknown error occured"});
  }
});

// Update a user
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { email, displayName, photoURL } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                displayName,
                photoURL,
            },
        });
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" , details:  error instanceof Error ? error.message : "An unknown error occured"});
    }
});

// Delete a user
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;