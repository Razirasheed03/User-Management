import React from 'react';
import { User } from 'lucide-react';
import './Home.css'; 

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <header className="header">
          <h1 className="logo2">User Management</h1>
          <nav>
            {/* <a href="/profile" className="profile-link">
              <User size={18} />
              <span>Profile</span>
            </a> */}
          </nav>
        </header>

        <main className="main">
          <div className="welcome-box">
            <h2 className="welcome-title">Welcome To my Home Page Broo !</h2>
            <p className="welcome-text">
              We're glad you're here. Get started by exploring our features or visit your profile to add Your Profile Picture.
            </p>
            <div className="button-wrapper">
              {/* <a href="/profile" className="profile-button">Go to Profile</a> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
