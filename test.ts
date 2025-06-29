import prisma from './src/config/db.config';

async function test() {
  // 1. Crear una categoría si no existe
  const category = await prisma.category.create({
    data: {
      name: 'Sillas',
      slug: 'sillas'
    }
  });

  console.log('Categoría creada:', category);

  // 2. Desactivar la categoría recién creada
  const updated = await prisma.category.update({
    where: { id: category.id },
    data: {
      is_active: false,
      deleted_at: new Date()
    }
  });

  console.log('Categoría desactivada:', updated);
}

test();
