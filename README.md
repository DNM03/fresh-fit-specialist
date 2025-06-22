# Fresh Fit Specialist

A comprehensive specialist dashboard for fitness trainers and nutritionists on the Fresh Fit platform. Built with React and Vite for optimal performance and seamless user experience.

## Overview

Fresh Fit Specialist is a dedicated web application that empowers fitness professionals to manage their practice on the Fresh Fit platform, including appointment scheduling, client interactions, availability management, and community engagement.

## Features

### 📊 Dashboard

- Overview of upcoming appointments and schedule
- Quick access to key specialist functions

### 📅 Availability Management

- Set up and manage available time slots
- Configure working hours and days
- Edit existing availability schedules
- Delete or block specific time periods

### 🗓️ Appointment Management

- View and manage all appointments
- Attend scheduled sessions with clients
- Cancel appointments when necessary
- Conduct video calls directly through the platform
- Mark appointments as finished upon completion
- Real-time appointment status updates

### 📋 Appointment History

- Complete history of past appointments
- View session details and notes
- Access previous consultation records
- Generate appointment summaries

### 🏘️ Community Engagement

- Create and publish posts to the community
- Edit existing community content
- Share expertise and fitness tips
- Build professional presence within the platform

### ⚙️ Settings & Profile Management

- **Personal Information**: Update basic profile details
- **Skills & Specializations**: Manage areas of expertise
- **Certifications**: Add and update professional certifications
- **Education**: Maintain educational background information
- **Experience**: Document professional experience and achievements
- **Account Settings**: Manage login credentials and preferences

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Package Manager**: Yarn
- **Language**: TypeScript

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 16.0 or higher)
- Yarn (version 1.22 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/DNM03/fresh-fit-specialist.git
cd fresh-fit-specialist
```

2. Install dependencies using Yarn:

```bash
yarn install
```

3. Create a `.env` file in the root directory and configure your environment variables:

```env
VITE_API_URL=your_api_base_url
VITE_MEDIA_API_URL=example_media_api_url
VITE_MEDIA_BACKUP_URL=example_backup_url
VITE_API_PRODUCTION_URL=example_production_api_url
VITE_ZEGOCLOUD_APP_ID=example_id
VITE_ZEGOCLOUD_SERVER_URL=example_url
```

## Development

To start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## Build

To build the application for production:

```bash
yarn build
```

The built files will be generated in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
yarn preview
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint errors automatically
- `yarn type-check` - Run TypeScript type checking

## Project Structure

```
fresh-fit-specialist/
├── public/                 # Static assets
├── src/
│   ├── assets
│   ├── components/        # Reusable UI components
│   ├── constants
│   ├── features
│   ├── hooks
│   ├── lib
│   ├── pages/            # Application pages
│   │   ├── appointment/
│   │   ├── availability/
│   │   ├── community/
│   │   ├── dashboard/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── history/
│   │   └── settings/
│   ├── router/            # Routing configuration
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── App.tsx           # Main application component
├── package.json
├── vite.config.ts
├── ...
└── README.md
```

## Key Features Overview

### Appointment Workflow

1. **Set Availability** - Configure when you're available for appointments
2. **Manage Bookings** - Accept, reschedule, or cancel appointments
3. **Conduct Sessions** - Use integrated video calling for remote consultations
4. **Track History** - Maintain records of all past appointments and client progress

### Professional Profile

- Showcase qualifications, certifications, and experience
- Build credibility with detailed educational background
- Highlight specialized skills and areas of expertise
- Maintain up-to-date professional information

### Community Engagement

- Share knowledge through community posts
- Build professional reputation and client base
- Engage with platform users and potential clients
- Establish thought leadership in fitness and nutrition

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Development Guidelines

- Follow React best practices and hooks patterns
- Use TypeScript for type safety
- Write clean, self-documenting code
- Ensure responsive design for all components
- Test thoroughly before submitting pull requests
- Maintain HIPAA compliance for client data handling

## Support

For support and questions about the Fresh Fit Specialist application, please contact the development team or create an issue in the repository.

## License

This project is proprietary software for Fresh Fit platform specialists.

---

**Fresh Fit Specialist** - Empowering fitness professionals to deliver exceptional client experiences.
