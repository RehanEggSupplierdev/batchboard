# BatchBoard - Digital Class Community Platform

A modern web application for class communities to connect, share, and showcase their work.

## 🚀 Features

- **User Authentication**: Email-based signup and login system
- **Profile Management**: Customizable profiles with photos, bio, skills, and social links
- **Content Creation**: Create and publish pages with Markdown support
- **Student Directory**: Browse and search through all class members
- **Comments System**: Interactive commenting on profiles and pages
- **Real-time Updates**: Live updates for comments and interactions
- **Responsive Design**: Works perfectly on all devices

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd batchboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📝 How to Use

### Creating Your Account
1. Go to the login page
2. Click "Create New Account"
3. Fill in your details:
   - **Full Name**: Your real name
   - **Student ID**: A unique identifier (e.g., john123, student001)
   - **Email**: Your email address
   - **Password**: At least 6 characters

### Setting Up Your Profile
1. After signing up, go to Dashboard → Edit Profile
2. Add your bio, skills, and interests
3. Upload a profile picture
4. Add social media links
5. Make your profile public so others can find you

### Creating Content
1. Go to Dashboard → Pages
2. Click "Create New Page"
3. Write your content using Markdown
4. Publish to make it visible to others

### Exploring the Community
1. Visit the Students page to see all members
2. Use search and filters to find specific people
3. View individual profiles and their pages
4. Leave comments to interact with others

## 🔧 Demo Accounts

For testing purposes, you can use these demo accounts:
- **Email**: demo@example.com, **Password**: password
- **Email**: admin@example.com, **Password**: password

Or create your own account using the signup form!

## 🏗️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📱 Features Overview

### Authentication System
- Secure email-based authentication
- Password validation and security
- Profile creation on signup
- Session management

### Profile Management
- Rich profile customization
- Image upload support
- Skills and interests tracking
- Social media integration
- Privacy controls

### Content Creation
- Markdown editor with live preview
- Syntax highlighting for code
- Draft and publish workflow
- Rich text formatting

### Community Features
- Student directory with search
- Advanced filtering options
- Real-time commenting system
- Profile view tracking

## 🚀 Deployment

The app is configured for easy deployment on Netlify:

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on every push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your Supabase configuration
3. Ensure all environment variables are set
4. Check the network tab for API errors

For additional help, please create an issue in the repository.

---

**Happy coding! 🎉**