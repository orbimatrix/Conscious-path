# Senda Consciente

A modern, responsive landing page built with Next.js for Senda Consciente, featuring a comprehensive spiritual and wellness platform.

## 🌟 Features

### Design & User Experience
- **Fully Responsive Design** - Optimized for all devices (desktop, tablet, mobile)
- **Modern UI/UX** - Clean, elegant design with warm color palette
- **Smooth Animations** - Interactive elements with hover effects
- **Accessibility** - Proper semantic HTML and ARIA labels

### Sections & Components
- **Header** - Navigation with golden dollar sign logo and mobile menu
- **Hero Carousel** - Image carousel with navigation dots
- **Conscious Life Section** - Call-to-action for spiritual awakening
- **Path Awakening Section** - Service categories with icons
- **Portal Introduction** - Educational content about the platform
- **Exclusive Content** - Premium services showcase
- **Testimonials** - Customer reviews in card format
- **Registration** - User signup call-to-action
- **Videos & Audio** - Media content grid
- **Newsletter** - Email subscription with contact options
- **Contact Form** - User inquiry form
- **About Section** - Team member profile
- **Footer** - Comprehensive site navigation and legal information

### Technical Features
- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Type-safe development
- **CSS Modules** - Organized styling with global CSS
- **Image Optimization** - Next.js Image component for performance
- **Mobile-First** - Responsive design approach

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd conscious
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: CSS with responsive design
- **Icons**: Custom PNG icons and SVG graphics
- **Images**: Optimized with Next.js Image component
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
conscious/
├── public/                 # Static assets
│   ├── img/               # PNG icons and images
│   ├── fotos/             # Photo assets
│   ├── *.png              # Social media icons
│   └── *.svg              # SVG graphics
├── src/
│   └── app/
│       ├── components/    # React components
│       │   ├── Header.tsx
│       │   ├── CarouselSection.tsx
│       │   ├── ConsciousLifeSection.tsx
│       │   ├── PathAwakeningSection.tsx
│       │   ├── PortalIntroSection.tsx
│       │   ├── ExclusiveContentSection.tsx
│       │   ├── TestimonialsSection.tsx
│       │   ├── RegisterSection.tsx
│       │   ├── VideosSection.tsx
│       │   ├── NewsletterSection.tsx
│       │   ├── ContactSection.tsx
│       │   ├── AboutSection.tsx
│       │   └── FooterSection.tsx
│       ├── globals.css    # Global styles
│       ├── layout.tsx     # Root layout
│       └── page.tsx       # Main page component
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Gold**: #E6A14A (Golden accents)
- **Dark Gold**: #B8860B (Logo elements)
- **Warm Beige**: #F8F5ED (Footer background)
- **Muted Brown**: #9C8C70 (Text and borders)
- **Blue Accent**: #5A7DBE (Interactive elements)
- **Tan Background**: #D2B48C (Section backgrounds)

### Typography
- **Font Family**: Geist Sans (Google Fonts)
- **Headings**: Light to medium weight
- **Body Text**: Regular weight
- **Responsive**: Scales appropriately on mobile

### Spacing
- **Mobile**: 16px-24px margins
- **Desktop**: 24px-48px margins
- **Consistent**: 8px grid system

## 📱 Responsive Breakpoints

- **Mobile**: < 600px
- **Tablet**: 600px - 900px  
- **Desktop**: > 900px

## 🔧 Customization

### Adding New Sections
1. Create a new component in `src/app/components/`
2. Add styles to `src/app/globals.css`
3. Import and add to `src/app/page.tsx`

### Updating Content
- **Text**: Edit component files directly
- **Images**: Replace files in `public/` directory
- **Styling**: Modify `globals.css` classes

### Social Media Links
Update the footer component with actual URLs:
```tsx
<a href="https://facebook.com/yourpage" className="social-icon">
  <Image src="/facebook.png" alt="Facebook" width={20} height={20} />
</a>
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Custom domain configuration available

### Other Platforms
- **Netlify**: Compatible with Next.js
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

## 📄 License

This project is proprietary software for Senda Consciente.

## 👥 Contributing

For internal development:
1. Create feature branch
2. Make changes
3. Test responsiveness
4. Submit pull request

## 📞 Support

For technical support or questions about the platform, contact the development team.

---

**Built with ❤️ for Senda Consciente**
