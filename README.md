# Personal Web Portfolio

A modern, responsive personal web portfolio built with React, TypeScript, and Tailwind CSS. This project is designed to be easily deployed to GitHub Pages or Firebase with Firebase Firestore for backend services.

## Features

- **Modern Tech Stack**: React, TypeScript, Tailwind CSS
- **Component Library**: Uses Radix UI primitives with custom styling
- **Firebase Integration**: Firestore for contact form submissions
- **Responsive Design**: Mobile-friendly interface
- **Contact Form**: Integrated with Firebase Firestore
- **Fast Development**: Vite for frontend development
- **Multiple Deployment Options**: Deploy to GitHub Pages or Firebase Hosting

## Project Structure

```
/
├── client/                   # Frontend React application
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   └── ui/           # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions and configuration
│   │   │   ├── firebase.ts   # Firebase configuration
│   │   │   └── firebaseService.ts # Firebase service functions
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   └── index.html            # HTML template
├── .github/                  # GitHub configuration
│   └── workflows/            # GitHub Actions workflows
│       ├── deploy.yml        # GitHub Pages deployment workflow
│       └── firebase-deploy.yml # Firebase deployment workflow
├── firebase.json             # Firebase configuration
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore indexes
├── package.json              # Project dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
└── vite.config.ts            # Vite bundler configuration
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Firebase account (for Firestore)

### Installation

1. Clone the repository

   ```
   git clone <repository-url>
   cd PersonalWeb
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Set up Firebase
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore database
   - Get your Firebase configuration (apiKey, authDomain, etc.)
   - Add your Firebase configuration as environment variables:
     - Create a `.env.local` file at the root with the following:
       ```
       VITE_FIREBASE_API_KEY=your_api_key
       VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
       VITE_FIREBASE_PROJECT_ID=your_project_id
       VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
       VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
       VITE_FIREBASE_APP_ID=your_app_id
       VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
       ```

### Development

Start the development server:

```
npm run dev
```

This will start the frontend development server. Access the application at http://localhost:5173.

### Production Build

Build the application for production:

```
npm run build
```

Preview the production build:

```
npm run preview
```

### Deployment Options

#### GitHub Pages

Deploy to GitHub Pages:

```
npm run deploy:gh-pages
```

Alternatively, pushing to the main branch will trigger the GitHub Actions workflow to automatically deploy to GitHub Pages.

#### Firebase Hosting

1. Login to Firebase (one-time setup):

   ```
   npx firebase login
   ```

2. Initialize Firebase (one-time setup):

   ```
   npx firebase init
   ```

3. Deploy to Firebase:
   ```
   npm run deploy:firebase
   ```

Alternatively, pushing to the main branch will trigger the GitHub Actions workflow to automatically deploy to Firebase (if configured with secrets).

## Project Structure Details

### Frontend

The frontend is built with React and uses the following organization:

- **Components**: Reusable UI components located in `client/src/components`
- **Pages**: Page-level components in `client/src/pages`
- **Hooks**: Custom React hooks in `client/src/hooks`
- **Lib**: Utility functions and configuration in `client/src/lib`
  - **Firebase**: Firebase configuration and service functions

### Firebase

Firebase Firestore is used for:

- Storing contact form submissions
- (Potentially) User authentication
- (Potentially) Other dynamic data storage needs

### CI/CD

Automated deployment workflows are included for:

- GitHub Pages deployment
- Firebase Hosting deployment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
