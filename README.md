# User Management App

A modern Angular application for managing users with a clean, responsive UI built with Bootstrap 5.

## Features

- ✅ **User List Display**: Shows all users in a clean table format
- ✅ **Bulk Selection**: Select all/deselect all functionality
- ✅ **Individual Selection**: Select specific users with checkboxes
- ✅ **Action Buttons**: Expandable action menu for each user
- ✅ **User Status Management**: Activate/Deactivate users
- ✅ **Group Assignment**: Assign users to different groups with dropdown
- ✅ **User Creation**: Create new users with a modal form
- ✅ **User Deletion**: Delete individual or multiple users
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Dummy Data**: Pre-populated with 12 sample users

## Groups Available

1. **Administrators** - System administrators with full access
2. **Developers** - Development team members
3. **Support** - Customer support and QA team

## Technologies Used

- Angular 17
- Bootstrap 5
- Font Awesome Icons
- TypeScript
- RxJS

## Local Development

### Prerequisites
- Node.js (version 18 or higher)
- npm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd usermanagement-mock/user-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build:prod
```

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. **Push to main/master branch**: The app will automatically build and deploy
2. **GitHub Actions**: Uses the workflow in `.github/workflows/deploy.yml`
3. **Live URL**: Available at `https://yourusername.github.io/usermanagement-mock/`

### Manual Deployment

If you prefer manual deployment:

```bash
# Build for production with correct base href
npm run build:prod

# Deploy using angular-cli-ghpages
npm run deploy
```

### Setup GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "Deploy from a branch"
4. Choose "gh-pages" branch
5. Set folder to "/ (root)"

## Project Structure

```
user-management-app/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── user.interface.ts      # User and Group interfaces
│   │   ├── services/
│   │   │   └── user.service.ts        # User data service
│   │   ├── user-management/
│   │   │   ├── user-management.ts     # Main component logic
│   │   │   ├── user-management.html   # Template
│   │   │   └── user-management.css    # Component styles
│   │   ├── app.component.ts           # Root component
│   │   └── app.module.ts              # App module
│   ├── index.html                     # Main HTML file
│   ├── main.ts                        # Bootstrap file
│   └── styles.css                     # Global styles
├── angular.json                       # Angular CLI configuration
├── package.json                       # Dependencies and scripts
└── tsconfig.json                      # TypeScript configuration
```

## Features Breakdown

### 1. User Display
- Avatar images generated automatically
- User information displayed in clean table format
- Status badges with color coding
- Group assignment badges

### 2. Selection System
- Master checkbox for select all/deselect all
- Individual user selection
- Visual feedback for selected users
- Selected count display

### 3. Action Menu
- Expandable dropdown for each user
- Status management (Activate/Deactivate)
- Group assignment with current group indication
- Delete user option

### 4. User Management
- Create new users with modal form
- Bulk delete selected users
- Form validation
- Auto-generated avatars

### 5. Responsive Design
- Mobile-friendly interface
- Bootstrap 5 responsive grid
- Touch-friendly buttons and interactions

## Data Structure

### User Interface
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  group: string;
  role: string;
  joinDate: string;
  lastLogin: string;
  avatar?: string;
}
```

### Group Interface
```typescript
interface Group {
  id: number;
  name: string;
  description: string;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes.
