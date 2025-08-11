# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-08-12

### Added
- **User Authentication System**: Complete Clerk.js integration for user management
  - User registration and login functionality
  - Protected routes and authentication middleware
  - User profile management system
  - Webhook integration for user events

- **Database Integration**: PostgreSQL database with Drizzle ORM
  - User table with comprehensive profile fields
  - Subscription management system
  - Points and level progression tracking
  - Daily points claiming functionality

- **User Management Features**:
  - `src/lib/auth.ts` - Authentication utilities and middleware
  - `src/lib/db/schema.ts` - Database schema definitions
  - `src/lib/db/index.ts` - Database connection and utilities
  - `src/lib/db/migrate.ts` - Database migration utilities

- **API Routes**:
  - `src/app/api/user/profile/route.ts` - User profile management
  - `src/app/api/webhooks/clerk/route.ts` - Clerk webhook handling

- **User Interface Components**:
  - `src/app/components/DailyPointsModal.tsx` - Daily points claiming modal
  - `src/app/components/UserProfileInfo.tsx` - User profile information display
  - `src/app/components/UserProfilePicture.tsx` - User profile picture management
  - `src/app/usuario/page.tsx` - User profile page with comprehensive management

### Database Schema Updates
- **User Table Enhancements**:
  - Added `birth_date`, `city`, `telegram`, `signal` fields
  - Added `is_active`, `points`, `level` fields for user progression
  - Added `last_daily_claim` timestamp for daily points system
  - Enhanced user level system (inmortal, carisma, benec, karma, renacer)

- **Subscription Management**:
  - New `user_subscriptions` table for plan management
  - Support for carisma and karma subscription types
  - Subscription status tracking and date management

### Technical Improvements
- **Next.js Upgrade**: Updated to Next.js 15.4.4
- **React Upgrade**: Updated to React 19.1.0
- **Tailwind CSS**: Integrated Tailwind CSS v4
- **Database Migrations**: Comprehensive migration system with Drizzle Kit
- **Type Safety**: Enhanced TypeScript types for database operations
- **Environment Configuration**: Proper environment variable management

### Security Enhancements
- **Authentication Middleware**: Protected routes and API endpoints
- **Webhook Security**: Secure Clerk webhook handling
- **Database Security**: Proper connection pooling and query sanitization
- **Environment Variables**: Secure configuration management

## [1.1.0] - 2025-07-31

### Added
- **Blog System**: Complete blog functionality with Sanity CMS integration
  - `blogs/page.tsx` - Blog listing page with grid layout and filtering
  - `blogs/[slug]/page.tsx` - Individual blog post pages with dynamic routing
  - `blogs/[slug]/not-found.tsx` - Custom 404 page for blog posts
  - `blogs.css` - Comprehensive styling for blog listing page
  - `blog-post.css` - Detailed styling for individual blog posts
  - `not-found.css` - Styling for blog 404 pages

### Blog Features
- **Blog Listing Page**: Grid layout displaying all blog posts with featured images
- **Dynamic Routing**: Individual blog post pages with slug-based URLs
- **Sanity CMS Integration**: Content management system for blog posts
- **Responsive Design**: Mobile-optimized blog layouts
- **Meta Information**: Author, publication date, and categories display
- **Image Optimization**: Responsive images with proper alt text
- **SEO Friendly**: Proper heading hierarchy and semantic structure

### New Pages
- **Contenidos Page**: Content management and display page
- **Benec Page**: Benefits and features information page
- **Abundancia Page**: Abundance and prosperity content page
- **Bienestar Page**: Wellness and well-being information page
- **Aportes Page**: Contributions and support page
- **Invitar Page**: Invitation and referral system page
- **Limpiar Karma Page**: Karma cleansing information page
- **Estructural Page**: Structural and foundational content page
- **Mente Unica Page**: Unique mind and consciousness page
- **Normas Page**: Rules and guidelines page
- **Privado Page**: Private content access page
- **Registration Page**: User registration system
- **Regresion Page**: Regression and past life content page
- **Aviso Legal Page**: Legal notice and terms page
- **Privacidad Page**: Privacy policy page
- **Pay Success/Fail Pages**: Payment result pages

### Technical Improvements
- **Enhanced Routing**: Dynamic routes for blog posts and content pages
- **Content Management**: Sanity CMS integration for blog content
- **Image Handling**: Optimized image loading and display
- **Error Handling**: Custom 404 pages for better user experience
- **Component Architecture**: Reusable components across multiple pages

### Styling Enhancements
- **Blog Styling**: Comprehensive CSS for blog functionality
- **Responsive Grids**: Adaptive layouts for different content types
- **Typography**: Improved text hierarchy and readability
- **Interactive Elements**: Enhanced hover effects and transitions

## [1.0.0] - 2025-07-29

### Added
- **New Pages**: Created 5 new pages for the conscious path web application
  - `conocimiento/page.tsx` - Knowledge/Content page with video grid and filters
  - `acceder/page.tsx` - Plan selection page with payment modal
  - `carisma/page.tsx` - Charisma level information page
  - `karma/page.tsx` - Karma level information page  
  - `renacer/page.tsx` - Conscious rebirth level page
  - `sendas_renacer/page.tsx` - Rebirth paths information page

### Features

#### Conocimiento Page
- **Hero Section**: Added image display with responsive sizing
- **Filter Buttons**: Interactive filter system (Todo, Público, Inmortal, Carisma, Abundancia, Karma)
- **Video Grid**: 2x3 grid layout with video/audio cards
- **Interactive Cards**: Clickable video cards with modal details
- **Checkbox System**: Mark videos as watched with state management
- **Modal System**: Detailed video information modal with mobile optimization
- **Responsive Design**: Mobile-first approach with breakpoints at 960px, 768px, 480px, 360px

#### Acceder Page
- **Plan Selection**: Two-tier pricing system (NIVEL CARISMA $15/mo, NIVEL KARMA $150/mo)
- **Feature Comparison**: Detailed feature lists with red cross indicators for excluded items
- **Payment Modal**: Comprehensive payment selection with monthly/annual options
- **Contact Options**: Crypto payment, alternative payment methods, special requests
- **Dynamic Pricing**: Real-time price updates based on plan selection
- **Mobile Optimization**: Responsive design for all screen sizes

#### Carisma Page
- **Hero Section**: "NIVEL CARISMA" title with benefits list
- **Image Section**: Responsive image display with proper centering
- **Information Section**: Detailed content about charisma level
- **Action Section**: Content list with audio/video information
- **Video Section**: Presentation video with CTA buttons
- **Responsive Design**: Optimized for mobile and desktop

#### Karma Page
- **Content Structure**: Similar to Carisma page with karma-specific content
- **Merged Sections**: Combined content blocks for better layout
- **Influences Section**: Information about influences and possessions
- **Reincarnation Section**: Details about karma and reincarnation
- **Conscious Rebirth Access**: Information about advanced level access

#### Renacer Page
- **Hero Section**: "NIVEL RENACER CONSCIENTE" with benefits
- **Image Display**: Large responsive image with proper centering
- **Information Section**: Memory preservation content
- **Banner Section**: Annual procedure limit information
- **Options Section**: Two access paths (Karma level assistants, Express access)
- **Video Section**: Presentation with CTA buttons
- **Enhanced Image Sizing**: Optimized for large screens (1400px container, 1200px image)

#### Sendas Renacer Page
- **Clean Layout**: Minimalist design with two-tone sections
- **Requirements Comparison**: Side-by-side comparison of Karma Level vs Direct Access
- **Interactive Buttons**: Two CTA buttons with modal functionality
- **Modal System**: Two different modals for different access methods
- **Contact Integration**: Reused ContactSection component
- **Free Access Information**: Details about free access opportunities
- **Mobile Optimization**: Responsive design with proper spacing

### Technical Improvements

#### CSS Architecture
- **External CSS Files**: Moved from inline styles to dedicated `.css` files
- **Modular Design**: Each page has its own CSS file for maintainability
- **Responsive Breakpoints**: Consistent mobile-first approach
- **Custom Scrollbars**: Hidden scrollbars (0px width) for clean appearance
- **Color Consistency**: Unified color scheme using `#6284AB` for buttons

#### Component Reusability
- **Header Component**: Reused across multiple pages
- **Footer Component**: Consistent footer implementation
- **Contact Component**: Integrated into modals and pages
- **Modal System**: Reusable modal structure with different content

#### State Management
- **useState Hooks**: Proper state management for interactive elements
- **Modal States**: Separate state for different modals
- **Checkbox States**: Track watched videos and selected items
- **Plan Selection**: Dynamic plan and payment selection

#### Mobile Optimization
- **Touch-Friendly**: Proper button sizes and spacing
- **Responsive Grids**: Adaptive layouts for different screen sizes
- **Typography Scaling**: Appropriate font sizes for mobile
- **Modal Optimization**: Mobile-friendly modal interactions

### Styling Enhancements
- **Color Scheme**: Consistent blue-gray theme (`#6284AB`)
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: Consistent padding and margins throughout
- **Interactive Elements**: Hover effects and transitions
- **Visual Indicators**: Red crosses for excluded features

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and structure
- **Keyboard Navigation**: Accessible button and link interactions
- **Screen Reader Support**: Proper alt text and ARIA labels
- **Focus Management**: Clear focus indicators

### Performance
- **Optimized Images**: Responsive image sizing
- **Efficient CSS**: Minimal and focused stylesheets
- **Component Optimization**: Reusable components reduce code duplication
- **State Efficiency**: Minimal re-renders with proper state management

### Browser Compatibility
- **Cross-Browser Support**: Works on Chrome, Firefox, Safari, Edge
- **CSS Compatibility**: Fallbacks for older browsers
- **Scrollbar Styling**: Support for Webkit, Firefox, and IE/Edge

## [0.1.0] - Initial Setup
- **Project Structure**: Next.js application setup
- **Component Architecture**: Basic component structure
- **Routing System**: Page routing implementation
- **Development Environment**: Development and build configuration 