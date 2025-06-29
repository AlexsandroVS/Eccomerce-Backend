-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "min_stock" INTEGER DEFAULT 5,
ADD COLUMN     "stock" INTEGER DEFAULT 0;
