# MVP Development Plan for Kusina de Amadeo

## Core MVP Features

### 1. Authentication System (Essential)
- [x] Google OAuth Integration
  - [x] Sign in with Google
  - [x] User session management
- [x] Basic Role System
  - [x] Customer role
  - [x] Admin role
  - [x] Role-based access control
- [ ] Required User Profile Fields
  - [x] Email (from Google)
  - [x] Full name
  - [ ] Phone number
  - [ ] Basic address info

### 2. Product Management (Core)

#### Categories Management
- [x] Four Main Categories Only
  - [x] Category creation/editing
  - [ ] Category limit enforcement
  - [x] Category organization structure
- [x] Image upload and management
  - [x] Category image upload
  - [x] Image optimization
  - [x] Cloud storage integration

#### Product Information
- [x] Basic Product Details
  - [x] Name
  - [x] Description
  - [x] Price
  - [x] Product code
- [x] Stock Status Management
  - [x] In stock/Out of stock indicators
  - [x] Stock level tracking
- [x] Image Management
  - [x] Single product image
  - [x] Upload/update functionality
  - [x] Image preview
- [x] Category Assignment
  - [x] Single category selection
  - [x] Category filtering

#### Variants System
- [ ] Beverage Size Variants
  - [ ] Regular (16oz)
  - [ ] Large (22oz)
  - [ ] Price adjustments per size
- [ ] Flavor Variants
  - [ ] Basic flavor selection
  - [ ] Price adjustments per flavor

#### Global Add-ons System
- [ ] Budget/Silog Meals Add-ons
  - [ ] Basic add-on management
  - [ ] Add-on pricing structure
  - [ ] Add-on availability toggle
  - [ ] Image upload and management (optional)

### 3. Order System (Essential)
- [x] Cart Functionality
  - [x] Add/remove items
  - [x] Update quantities
  - [x] Calculate totals
  - [x] Cart persistence
- [ ] Order Placement
  - [x] Order confirmation
  - [x] Order details review
  - [ ] Delivery/pickup selection
- [ ] Payment Processing
  - [ ] GCash (manual verification)
  - [ ] Cash on pickup
  - [ ] Payment status tracking
- [ ] Order Tracking
  - [x] Basic status updates
  - [x] Receipt generation (2 letters + 2 numbers)
  - [ ] Order history

### 4. Store Operations (Basic)
- [ ] Store Hours Management
  - [ ] Operating hours setup
  - [ ] Holiday/special hours
- [x] Order Status Management
  - [x] Basic status updates
  - [x] Order fulfillment tracking
  - [x] Admin order dashboard
- [x] Inventory Management
  - [x] Simple stock tracking
  - [x] Low stock alerts
  - [x] Stock update history

## Implementation Notes
- [x] Focus on essential features first
- [x] Keep interfaces simple and user-friendly
- [x] Implement basic functionality before adding complexity
- [x] Ensure mobile responsiveness
- [x] Maintain clear documentation
- [x] Error handling implementation
- [x] Loading states and feedback

## Future Considerations
- Advanced inventory management
- Enhanced reporting and analytics
- Customer loyalty system
- Automated payment verification
- Multiple image support
- Order scheduling system
- Customer feedback system
- Advanced variant management
