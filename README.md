# 📝 Journal Application: Your Personal Reflection Companion

## 🌟 Overview

Your personal space for reflection, creativity, and growth with a thoughtful assistant by your side, ready to help you explore your thoughts and feelings. With a sprinkle of AI magic and a dash of modern web technology, this app transforms your journaling experience into something truly special.

## 🎉 Features

- **Create & Manage Entries**: Write down your thoughts, dreams, and daily adventures. You can edit, delete, or revisit them whenever you like.
- **Directory Selection**: Choose where to store your journal entries. Whether on your local machine or in the cloud, the choice is yours.
- **AI-Powered Prompts**: Stuck on what to write? Let AI generate introspective prompts that spark your creativity and encourage self-reflection.
- **Semantic Search**: Want to find that one entry about your trip to Paris? Our smart search feature helps you locate relevant entries in a snap.
- **Responsive Design**: Whether you’re on your phone, tablet, or desktop, enjoy a seamless experience that adapts to your device. Journaling should be easy, no matter where you are.
- **Staying Secure**: Everything is kept local on your machine ensuring that no 3rd party organisation can access your data. What you write is yours and yours alone.

## 🚀 Technologies Used

- **Frontend**: React, Next.js, TypeScript (because who doesn’t love type safety?)
- **Styling**: Tailwind CSS (for that sleek, modern look)
- **AI Integration**: Azure AI Inference (your digital assistant)
- **State Management**: React Hooks (keeping everything in check)

## 🏁 Getting Started

### 🎈 Prerequisites

Before you dive in, make sure you have:
- Node.js (version 14 or higher)
- npm
- An Azure account with access to AI services (for that extra sprinkle of magic), or a github account

### 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/journal.git
   cd journal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root of the project and add your Azure credentials or Github PAT:
   ```plaintext
   GITHUB_TOKEN=your_github_token
   ```

### 🎉 Running the Application

To start your journaling adventure, fire up the development server:
```bash
npm run dev
# or
yarn dev
```

Now, grab your favorite beverage and head over to `http://localhost:3005` to start writing! It’s that simple.

### 🏗️ Building for Production

Ready to share your creation with the world? Build the application for production:
```bash
npm run build
# or
yarn build
```

Then, launch the production server:
```bash
npm start
# or
yarn start
```

This allows you to access your journal at `http://<YOUR-IP>:3005` from any device connected to the same network. You can find your IP address by running `ipconfig` in your terminal and getting the `IPv4 Address`. 

## ✍️ Usage

- **Selecting a Directory**: Click the "Select Directory" button and choose your journaling haven! It’s your space, make it yours.
- **Creating Entries**: Use the form to pour your heart out—no judgment here! Write freely and let your thoughts flow.
- **AI Prompts**: Feeling uninspired? Let our AI sprinkle some creativity into your writing. You might be surprised at what you discover!
- **Semantic Search**: Type in your query and watch the magic happen as we find your relevant entries.

