import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function generateSlug(base: string, model: 'product' | 'category' | 'template') {
  let slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let existing = await (prisma as any)[model].findFirst({ where: { slug } });
  
  if (existing) {
    let counter = 1;
    while (true) {
      const newSlug = `${slug}-${counter}`;
      existing = await (prisma as any)[model].findFirst({ where: { slug: newSlug } });
      if (!existing) return newSlug;
      counter++;
    }
  }
  
  return slug;
}