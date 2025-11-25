import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();

  const tasks = [
    {
      title: 'Supino Reto',
      description: 'Fazer 4 séries de 8-10 repetições no supino reto',
      completed: false,
    },
    {
      title: 'Agachamento',
      description: 'Fazer 5 séries de 5 repetições no agachamento',
      completed: false,
    },
    {
      title: 'Rosca Direta',
      description: 'Fazer 3 séries de 10-12 repetições na rosca direta',
      completed: true,
    },
    {
      title: 'Leg Press',
      description: 'Fazer 4 séries de 10 repetições no leg press',
      completed: false,
    },
    {
      title: 'Puxada Alta',
      description: 'Fazer 3 séries de 8-10 repetições na puxada alta',
      completed: false,
    },
    {
      title: 'Rosca Inversa',
      description: 'Fazer 3 séries de 10-12 repetições na rosca inversa',
      completed: true,
    },
    {
      title: 'Alongamento',
      description: 'Fazer alongamento de 10 minutos ao final do treino',
      completed: false,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: task,
    });
  }
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
