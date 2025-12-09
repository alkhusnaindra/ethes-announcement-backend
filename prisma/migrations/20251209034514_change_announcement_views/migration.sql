/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "AnnouncementView" DROP CONSTRAINT "AnnouncementView_employeeId_fkey";

-- AlterTable
ALTER TABLE "AnnouncementView" ALTER COLUMN "employeeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Employee_id_seq";

-- AddForeignKey
ALTER TABLE "AnnouncementView" ADD CONSTRAINT "AnnouncementView_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
