# Conscious Path - Web Application

A comprehensive web application for spiritual development and conscious evolution, featuring multiple levels of knowledge, user authentication, and interactive content management.

## 🌟 Overview

This Next.js application provides a platform for users to explore different levels of consciousness and spiritual development. The application features multiple pages with interactive elements, responsive design, user authentication, database integration, and a modern user interface.

## 📱 Pages & Features

### 🧠 Conocimiento (Knowledge)
- **Interactive Video Grid**: Browse and filter content by categories
- **Smart Filtering**: Filter by Todo, Público, Inmortal, Carisma, Abundancia, Karma
- **Video Cards**: Click to view detailed information and mark as watched
- **Modal System**: Detailed video information with mobile optimization
- **Responsive Design**: 2x3 grid on desktop, single column on mobile

### 🎯 Acceder (Access)
- **Plan Selection**: Choose between NIVEL CARISMA ($15/mo) and NIVEL KARMA ($150/mo)
- **Feature Comparison**: Detailed feature lists with visual indicators
- **Payment Modal**: Comprehensive payment options (monthly/annual)
- **Contact Integration**: Multiple contact methods including crypto payments
- **Dynamic Pricing**: Real-time price updates based on selection

### ✨ Carisma (Charisma Level)
- **Hero Section**: Introduction to the Charisma level
- **Benefits Display**: Key benefits and features
- **Content Sections**: Audio/video information and live sessions
- **Video Presentation**: Interactive video section with CTA buttons
- **Responsive Layout**: Optimized for all screen sizes

### 🕉️ Karma (Karma Level)
- **Advanced Content**: Information about influences and possessions
- **Reincarnation Details**: Karma and reincarnation information
- **Conscious Rebirth Access**: Details about advanced level access
- **Merged Layout**: Combined content sections for better flow

### 🌅 Renacer (Conscious Rebirth)
- **Memory Preservation**: Information about preserving memories across lives
- **Annual Limits**: Details about procedure availability (max 3 per year)
- **Access Options**: Two paths - Karma level assistants or Express access
- **Enhanced Images**: Large, responsive images optimized for all screens
- **Video Section**: Presentation with call-to-action buttons

### 🛤️ Sendas Renacer (Rebirth Paths)
- **Requirements Comparison**: Side-by-side comparison of access methods
- **Interactive Modals**: Two different modals for different access paths
- **Free Access Information**: Details about free access opportunities
- **Contact Integration**: Seamless contact form integration
- **Clean Design**: Minimalist layout with two-tone sections

### 📚 Blog System
- **Content Management**: Sanity CMS integration for blog posts
- **Dynamic Routing**: Individual blog post pages with slug-based URLs
- **Responsive Design**: Mobile-optimized blog layouts
- **SEO Friendly**: Proper heading hierarchy and semantic structure

### 👤 User Management
- **Authentication**: Clerk.js integration for user authentication
- **User Profiles**: Comprehensive user profile management
- **Points System**: Daily points claiming and level progression
- **Subscription Management**: Plan-based access control
- **Database Integration**: PostgreSQL with Drizzle ORM

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules with responsive design
- **State Management**: React Hooks (useState)
- **Components**: Reusable React components
- **Responsive Design**: Mobile-first approach
- **Authentication**: Clerk.js for user management
- **Database**: PostgreSQL with Drizzle ORM
- **CMS**: Sanity for content management
- **Styling**: Tailwind CSS v4 integration

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#6284AB` - Used for buttons and interactive elements
- **Orange Accent**: `#EFA540` - Used for prices and highlights
- **Text Colors**: `#333` (dark), `#666` (medium), `#999` (light)
- **Backgrounds**: White, light gray (`#f8f8f8`), brownish (`#f5f2ed`)

### Typography
- **Font Family**: Arial, sans-serif
- **Heading Hierarchy**: Clear font size progression
- **Mobile Optimization**: Responsive font sizing

### Layout Principles
- **Mobile-First**: Responsive design starting from mobile
- **Grid Systems**: Flexible grid layouts
- **Consistent Spacing**: Uniform padding and margins
- **Touch-Friendly**: Proper button sizes for mobile interaction

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (full layout)
- **Large Tablet**: 960px-1199px (adjusted grid)
- **Tablet**: 768px-959px (single column)
- **Mobile**: 480px-767px (compact layout)
- **Small Mobile**: 320px-479px (minimal spacing)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Clerk.js account for authentication
- Sanity account for CMS

### Environment Setup
Create a `.env.local` file with the following variables:
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Database
DATABASE_URL=your_postgres_connection_string

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
```

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd conscious

# Install dependencies
npm install

# Set up database
npm run db:generate
npm run db:migrate

# Start development server
npm run dev
```

### Build for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── FooterSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── DailyPointsModal.tsx
│   │   ├── UserProfileInfo.tsx
│   │   └── UserProfilePicture.tsx
│   ├── api/
│   │   ├── user/profile/route.ts
│   │   └── webhooks/clerk/route.ts
│   ├── conocimiento/
│   │   ├── page.tsx
│   │   └── conocimiento.css
│   ├── acceder/
│   │   ├── page.tsx
│   │   └── acceder.css
│   ├── carisma/
│   │   ├── page.tsx
│   │   └── carisma.css
│   ├── karma/
│   │   ├── page.tsx
│   │   └── karma.css
│   ├── renacer/
│   │   ├── page.tsx
│   │   └── renacer.css
│   ├── sendas_renacer/
│   │   ├── page.tsx
│   │   └── sendas_renacer.css
│   ├── blogs/
│   │   ├── page.tsx
│   │   ├── blogs.css
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── blog-post.css
│   └── usuario/
│       ├── page.tsx
│       └── usuario.css
├── lib/
│   ├── auth.ts
│   └── db/
│       ├── index.ts
│       ├── schema.ts
│       └── utils.ts
└── sanity/
    ├── env.ts
    ├── lib/
    │   ├── client.ts
    │   ├── image.ts
    │   └── live.ts
    └── schemaTypes/
        ├── authorType.ts
        ├── blockContentType.ts
        ├── categoryType.ts
        ├── postType.ts
        └── index.ts
```

## 🔧 Key Features

### Interactive Elements
- **Modal Systems**: Reusable modal components with different content
- **State Management**: Proper React state management for interactive features
- **Form Integration**: Contact forms with validation
- **Payment Options**: Multiple payment methods including cryptocurrency

### User Management
- **Authentication**: Secure user authentication with Clerk.js
- **Profile Management**: Comprehensive user profile system
- **Points System**: Daily points claiming and level progression
- **Subscription Control**: Plan-based access management
- **Database Integration**: PostgreSQL with Drizzle ORM

### Content Management
- **Blog System**: Sanity CMS integration for content management
- **Dynamic Routing**: SEO-friendly URLs for blog posts
- **Image Optimization**: Responsive images with proper sizing
- **Content Filtering**: Advanced filtering and search capabilities

### Performance Optimizations
- **Image Optimization**: Responsive images with proper sizing
- **CSS Efficiency**: Minimal and focused stylesheets
- **Component Reusability**: Shared components reduce code duplication
- **Lazy Loading**: Efficient loading of content
- **Database Optimization**: Efficient queries with Drizzle ORM

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and structure
- **Keyboard Navigation**: Accessible button and link interactions
- **Screen Reader Support**: Proper alt text and ARIA labels
- **Focus Management**: Clear focus indicators

## 🎯 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📝 Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **Component Structure**: Functional components with hooks
- **CSS Organization**: Modular CSS files per page
- **Naming Conventions**: Consistent naming for classes and components

### State Management
- **useState Hooks**: For local component state
- **Event Handlers**: Proper event handling and propagation
- **Modal States**: Separate state for different modals
- **Form States**: Controlled form inputs

### Database Management
- **Migrations**: Use Drizzle Kit for database schema changes
- **Schema Updates**: Follow migration naming conventions
- **Data Types**: Use appropriate PostgreSQL data types
- **Relationships**: Proper foreign key constraints

### Responsive Design
- **Mobile-First**: Start with mobile design
- **Breakpoint Consistency**: Use defined breakpoints
- **Touch Optimization**: Proper touch targets
- **Typography Scaling**: Responsive font sizes

## 🔄 Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history and feature updates.

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

---

**Built with ❤️ for conscious evolution and spiritual development**
