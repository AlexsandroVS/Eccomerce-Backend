/*
  Warnings:

  - You are about to drop the column `style_tags` on the `DesignTemplate` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `attributes` on the `Product` table. All the data in the column will be lost.
  - The `type` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `billing_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('SIMPLE', 'VARIABLE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "RatingValue" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DESIGNER';

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_variant_id_fkey";

-- DropIndex
DROP INDEX "Order_user_id_status_idx";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "attributes_normalized" JSONB;

-- AlterTable
ALTER TABLE "DesignTemplate" DROP COLUMN "style_tags",
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sales_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "style" TEXT,
ADD COLUMN     "total_price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "DesignTemplateProduct" ADD COLUMN     "notes" TEXT,
ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "is_optional" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "billing_address" JSONB NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "shipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shipping_address" JSONB NOT NULL,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "discount_applied" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "product_id" TEXT,
ADD COLUMN     "template_id" TEXT,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "variant_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "attributes",
ADD COLUMN     "base_price" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "sales_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stock_alert" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "type",
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'SIMPLE',
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "attributes" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "billing_address" JSONB,
ADD COLUMN     "shipping_address" JSONB;

-- CreateTable
CREATE TABLE "ProductReview" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" "RatingValue" NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryLog" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "movement" TEXT NOT NULL,
    "reason" TEXT,
    "reference_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Wishlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Wishlist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ProductReview_product_id_idx" ON "ProductReview"("product_id");

-- CreateIndex
CREATE INDEX "ProductReview_user_id_idx" ON "ProductReview"("user_id");

-- CreateIndex
CREATE INDEX "InventoryLog_product_id_idx" ON "InventoryLog"("product_id");

-- CreateIndex
CREATE INDEX "InventoryLog_variant_id_idx" ON "InventoryLog"("variant_id");

-- CreateIndex
CREATE INDEX "InventoryLog_created_at_idx" ON "InventoryLog"("created_at");

-- CreateIndex
CREATE INDEX "_Wishlist_B_index" ON "_Wishlist"("B");

-- CreateIndex
CREATE INDEX "DesignTemplate_slug_is_active_idx" ON "DesignTemplate"("slug", "is_active");

-- CreateIndex
CREATE INDEX "Order_user_id_idx" ON "Order"("user_id");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_created_at_idx" ON "Order"("created_at");

-- CreateIndex
CREATE INDEX "OrderItem_order_id_idx" ON "OrderItem"("order_id");

-- CreateIndex
CREATE INDEX "OrderItem_product_id_idx" ON "OrderItem"("product_id");

-- CreateIndex
CREATE INDEX "OrderItem_variant_id_idx" ON "OrderItem"("variant_id");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Product_slug_is_active_idx" ON "Product"("slug", "is_active");

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "Product"("type");

-- CreateIndex
CREATE INDEX "ProductVariant_is_active_stock_idx" ON "ProductVariant"("is_active", "stock");

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "DesignTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Wishlist" ADD CONSTRAINT "_Wishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Wishlist" ADD CONSTRAINT "_Wishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
