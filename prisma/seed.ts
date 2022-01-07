import { PrismaClient } from '@prisma/client'
import { ROLES, TRANSACTION_STATUS } from '../app/models/enum'
import { userBuilder } from '../app/models/__mocks__/user'

const prisma = new PrismaClient()

async function main() {
  // update or insert user with admin role
  await prisma.user.upsert({
    where: { email: 'me@zain.dev' },
    update: {},
    create: {
      email: 'me@zainf.dev',
      name: 'Zain',
      phoneNumber: '+6512345678',
      role: ROLES.ADMIN,
    },
  })

  // create user with author role
  const author = await prisma.user.create({
    data: userBuilder({ traits: ['author'] }),
  })

  // create user with member role
  const member = await prisma.user.create({ data: userBuilder() })

  // create another user with member role
  const anotherMember = await prisma.user.create({ data: userBuilder() })

  // create courses
  const courses = await Promise.all(
    getCourses().map((course) =>
      prisma.course.create({
        data: {
          authorId: author.id,
          ...course,
        },
      })
    )
  )

  // create transaction with status SUBMITTED
  await prisma.transaction.create({
    data: {
      userId: member.id,
      courseId: courses[0].id,
      authorId: courses[0].authorId,
      bankName: 'Bank Mandiri',
      bankAccountName: 'Pejuang Kode',
      bankAccountNumber: '123456789',
      amount: 25000,
      status: TRANSACTION_STATUS.SUBMITTED,
    },
  })

  // create transaction with status VERIFIED
  await prisma.transaction.create({
    data: {
      userId: member.id,
      courseId: courses[1].id,
      authorId: courses[1].authorId,
      bankName: 'Bank Mandiri',
      bankAccountName: 'Pejuang Kode',
      bankAccountNumber: '123456789',
      amount: 50000,
      status: TRANSACTION_STATUS.VERIFIED,
    },
  })

  await prisma.transaction.create({
    data: {
      userId: anotherMember.id,
      courseId: courses[2].id,
      authorId: courses[2].authorId,
      bankName: 'Bank Mandiri',
      bankAccountName: 'Pejuang Kode',
      bankAccountNumber: '123456789',
      amount: 25000,
      status: TRANSACTION_STATUS.VERIFIED,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

function getCourses() {
  return [
    {
      name: 'Menumbuhkan Minat Baca Anak',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      price: 25000,
      image: 'https://picsum.photos/id/1073/1200/800',
      category: 'Parenting',
    },
    {
      name: 'Mengelola Konflik dalam Keluarga',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      price: 50000,
      image: 'https://picsum.photos/id/146/1200/800',
      category: 'Parenting',
    },
    {
      name: 'Menumbuhkan Rasa Percaya Diri Sejak Dini',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      price: 100000,
      image: 'https://picsum.photos/id/1001/1200/800',
      category: 'Parenting',
    },
  ]
}
