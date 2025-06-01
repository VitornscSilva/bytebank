# Bytebank - Financial Management Application

A complete financial management frontend application built with Next.js, following the provided Figma design system.

## 🎥 Demo

![Bytebank Demo](./public/demo/demo.gif)

## 🚀 Features

### Core Functionality
- **Dashboard**: Welcome message, account balance display, recent transactions summary
- **Transaction Management**: Add, edit, delete, and view transaction history
- **Investment Portfolio**: View investment summary and statistics
- **Card Management**: Manage physical and digital cards
- **Services**: Access to various banking services
- **User Authentication**: Login and registration system

### Technical Features
- **Next.js 15.2.4** with App Router
- **API Routes** for server-side functionality
- **Tailwind CSS** for styling following the Figma design system
- **TypeScript** for type safety
- **Zustand** for state management
- **Radix UI** component library
- **Responsive Design** for mobile and desktop
- **Component-based Architecture** following modern React patterns

## 🎨 Design System

The application follows the Bytebank design system with:
- **Primary Colors**: Teal (#1e7b7b) and Green (#47A138)
- **Accent Colors**: Orange (#ff5722) and Red (#ef4444)
- **Background**: Light (#f0f4f4)
- **Typography**: Inter font family
- **Components**: Cards, buttons, forms, and navigation following the design specifications

## 📁 Project Structure

```
├── app/
│   ├── api/               # API routes for server-side functionality
│   │   ├── auth/          # Authentication endpoints
│   │   ├── transactions/  # Transaction CRUD operations
│   │   └── investments/   # Investment management
│   ├── dashboard/         # Dashboard page
│   ├── transactions/      # Transaction management pages
│   ├── investments/       # Investment portfolio pages
│   ├── services/          # Banking services pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components (Radix UI based)
│   ├── Header.tsx         # Application header
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── AuthModals.tsx     # Login/Register modals
│   ├── TransactionForm.tsx # Transaction form component
│   ├── TransactionList.tsx # Transaction list component
│   ├── TransactionModal.tsx # Transaction modal component
│   ├── LandingHeader.tsx  # Landing page header
│   ├── HeroSection.tsx    # Landing page hero
│   ├── BankFeatures.tsx   # Landing page features
│   └── Footer.tsx         # Application footer
├── stores/
│   ├── auth-store.ts      # Authentication state management
│   ├── transactions-store.ts # Transaction state management
│   └── investments-store.ts # Investment state management
├── types/
│   └── api/               # TypeScript type definitions
├── lib/                   # Utility functions and configurations
├── hooks/                 # Custom React hooks
├── styles/                # Additional stylesheets
├── public/
│   └── demo/              # Demo video
├── tailwind.config.ts     # Tailwind configuration
├── next.config.mjs        # Next.js configuration
└── README.md
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/VitornscSilva/bytebank
   cd financial-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Build & Deploy

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 📱 Pages & Features

### 1. Landing Page (`/`)
- Hero section with application overview
- Feature highlights and banking services
- Authentication modals (login/register)
- Call-to-action sections

### 2. Dashboard (`/dashboard`)
- Welcome message with user greeting
- Account balance with show/hide toggle
- Quick transaction buttons (deposit, transfer, withdrawal, payment)
- Recent transactions sidebar
- Navigation to other sections

### 3. Transactions (`/transactions`)
- Complete transaction history with animations
- Add new transactions via modal
- Edit existing transactions
- Delete transactions with confirmation
- Empty state when no transactions exist
- Real-time balance updates

### 4. Investments (`/investments`)
- Investment portfolio overview
- Fixed and variable income breakdown
- Investment statistics with charts (Recharts)
- Portfolio performance metrics
- Add/edit investment functionality

### 5. Services (`/services`)
- Available banking services grid
- Service categories (loans, insurance, etc.)
- Quick access to common operations
- Card management section

## 🎯 Component Architecture

### Core Components
- **Header**: User info, notifications, branding, authentication state
- **Sidebar**: Navigation menu with active states and user context
- **AuthModals**: Login and registration with form validation
- **TransactionModal**: Unified modal for add/edit transactions
- **TransactionList**: Animated transaction display with CRUD operations

### State Management
- **Zustand Stores**: Auth, Transactions, and Investments
- **Persistent Storage**: Authentication state persistence
- **Error Handling**: Centralized error management
- **Loading States**: UI feedback during async operations

### Design Patterns
- **Container/Presentational**: Separation of logic and UI
- **Composition**: Reusable component composition
- **TypeScript Interfaces**: Type safety throughout the application
- **Custom Hooks**: Reusable logic (toast notifications, etc.)

## 🎨 Styling Approach

### Tailwind CSS Configuration
- Custom color palette matching Figma design
- Component classes for consistent styling
- Responsive design utilities
- Animation utilities with Framer Motion

### CSS Architecture
- **Utility-first**: Tailwind CSS utilities
- **Component variants**: Class Variance Authority (CVA)
- **Design tokens**: Consistent spacing, colors, and typography
- **Responsive design**: Mobile-first approach

## 🔧 Technology Stack

### Frontend
- **Next.js 15.2.4**: React framework with App Router
- **TypeScript 5**: Type safety and developer experience
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Framer Motion 12.15.0**: Animation library
- **Radix UI**: Accessible component primitives

### State Management
- **Zustand 5.0.5**: Lightweight state management
- **React Hook Form 7.54.1**: Form state management
- **Zod 3.24.1**: Schema validation

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **pnpm**: Package management

## 📋 Feature Status

### ✅ Completed Features
- [x] User authentication (login/register)
- [x] Dashboard with balance and quick actions
- [x] Complete transaction CRUD operations
- [x] Transaction modal for add/edit
- [x] Investment portfolio management
- [x] Responsive design implementation
- [x] State management with Zustand
- [x] Form validation and error handling
- [x] Loading states and animations
- [x] Demo video creation

### 🚧 Future Enhancements
- [ ] Transaction filtering and search
- [ ] Export transactions to PDF/CSV
- [ ] Dark mode support
- [ ] Real-time notifications
- [ ] Investment charts enhancement
- [ ] Multi-language support
- [ ] PWA features

### 🔧 Technical Improvements
- [ ] Add unit tests (Jest + Testing Library)
- [ ] Implement E2E tests (Playwright)
- [ ] Add Storybook for component documentation
- [ ] Set up CI/CD pipeline
- [ ] Add error monitoring (Sentry)
- [ ] SSR/SSG optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Next.js and Tailwind CSS**
