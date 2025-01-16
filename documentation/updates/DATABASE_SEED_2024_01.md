# Database Seeding Documentation - January 2024

## Overview
This document details the implementation of the database seeding process for Kusina de Amadeo's product management system. The seeding process initializes the database with essential product data, categories, variants, and global add-ons.

## Implementation Details

### 1. Data Structure
The seeding process populates the following tables:
- Categories
- Products
- ProductVariants
- GlobalAddons

### 2. Categories
Four main categories have been implemented:
1. Budget Meals
   - Description: Affordable meal options for everyone
   - Image: `/images/categories/budget-meals.png`
   - Sort Order: 1

2. Silog Meals
   - Description: Filipino breakfast combinations with rice and egg
   - Image: `/images/categories/silog-meals.png`
   - Sort Order: 2

3. Ala Carte
   - Description: Individual dishes and snacks
   - Image: `/images/categories/ala-carte.png`
   - Sort Order: 3

4. Beverages
   - Description: Refreshing drinks and beverages
   - Image: `/images/categories/beverages.png`
   - Sort Order: 4

### 3. Products by Category

#### Budget Meals
- Hotsilog (₱60)
- Hamsilog (₱55)
- Silog (₱35)
- Skinless Rice (₱40)
- Pork Chaofan (₱45)
- Beef Chaofan (₱50)
- Siomai Rice (₱39)
- Shanghai Rice (₱39)

#### Silog Meals
- Tapsilog (₱100)
- Porksilog (₱95)
- Chicksilog (₱95)
- Bangsilog (₱100)
- Sisigsilog (₱95)
- Tocilog (₱85)

#### Ala Carte
- Waffle (Variable pricing based on variants)
  - Variants: Chocolate, Cheese, Hotdog (₱15 each)
- Siomai (Variable pricing based on variants)
  - Variants: Chicken, Beef (₱5 each)
- Lugaw (₱20)
- Goto (₱35)
- Beef Mami (₱45)
- Pares (₱60)
- Fries (₱25)
- Graham Bar (₱20)
- Cheese Stick (₱10)

#### Beverages
- Coke Float
  - 16oz (₱29)
  - 22oz (₱39)
- Fruit Soda
  - 16oz Variants (₱29): Blueberry, Strawberry, Lemon, Green Apple, Lychee
  - 22oz Variants (₱39): Blueberry, Strawberry, Lemonade, Green Apple, Lychee
- Iced Coffee (₱29)
- Hot Coffee (₱29)

### 4. Global Add-ons
Available add-ons across products:
- Extra Siomai (₱5)
- Extra Shanghai (₱5)
- Extra Skinless (₱10)
- Extra Egg (₱15)
- Extra Hotdog (₱15)
- Extra Sauce (₱5)

## Technical Implementation

### Seeding Process
1. **Cleanup Phase**
   - Deletes existing data in reverse dependency order
   - Ensures clean slate for seeding

2. **Category Creation**
   - Creates all categories with proper sorting
   - Establishes base structure for products

3. **Product Population**
   - Populates products by category
   - Sets base prices and availability
   - Configures add-on allowance

4. **Variant Setup**
   - Creates variants for applicable products
   - Implements size and flavor variations
   - Sets variant-specific pricing

5. **Add-on Configuration**
   - Establishes global add-ons
   - Sets pricing and availability

### Image Management
- All product images stored in `/public/images/products/`
- Variant images in `/public/images/variants/`
- Category images in `/public/images/categories/`
- All images standardized to PNG format

## Data Relationships
- Products are linked to Categories via `categoryId`
- Variants are linked to Products via `productId`
- Products can optionally allow global add-ons

## Usage Instructions

### Running the Seed
```bash
npx prisma db seed
```

### Modifying Seed Data
1. Edit `prisma/seed.ts`
2. Update corresponding images in public directories
3. Run migration if schema changes
4. Execute seed command

## Validation Points
- ✅ All categories properly created
- ✅ Products correctly associated with categories
- ✅ Variants properly linked to products
- ✅ Pricing accurately set
- ✅ Images correctly referenced
- ✅ Add-ons properly configured

## Future Considerations
1. **Scalability**
   - Structure supports easy addition of new categories
   - Flexible variant system for future products
   - Extensible add-on framework

2. **Maintenance**
   - Clear separation of concerns for easy updates
   - Modular structure for partial updates
   - Version control friendly organization

3. **Performance**
   - Optimized database operations
   - Efficient image management
   - Scalable data structure

## Related Documentation
- Schema Documentation: `documentation/Database_schema.md`
- Product Guidelines: `documentation/guidelines/Products2.md`
- Setup Guide: `documentation/setup/DATABASE_SETUP.md`

## Version Information
- Implementation Date: January 16, 2024
- Schema Version: 1.0.0
- Data Version: 1.0.0
