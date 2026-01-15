# dashboard-extension

Personal Dashboard Chrome Extension
A minimalist, high-performance Chrome Extension that replaces the "New Tab" page with a beautiful, data-driven dashboard. Built with vanilla JavaScript and integrated with multiple third-party APIs.

🚀 Features:

Dynamic Backgrounds: Fetches high-definition landscape photography from Unsplash based on nature themes.

Real-time News: Displays the latest breaking news headline using NewsAPI.

Live Weather: Uses the Geolocation API to detect user location and fetch current conditions and temperatures from OpenWeatherMap.

Dynamic Clock: A clean, real-time clock that updates every second.

Responsive Design: A glassmorphism-inspired UI that adapts to various screen sizes.

🛠️ Tech Stack:

HTML5 & CSS3 (Flexbox, CSS Variables, Glassmorphism)

Vanilla JavaScript (ES6+, Fetch API, Async/Await)

Manifest V3 (Chrome Extension API)

⚙️ Setup & Installation:

1. Clone the repository:

Bash

git clone https://github.com/Anuska86/dashboard-extension.git

2. Create a config.js file in the root directory (this file is ignored by Git for security).

3. Add your API keys to config.js:

JavaScript

const config = {
NEWS_API_KEY: "your_news_api_key_here",
WEATHER_API_KEY: "your_weather_api_key_here"
};

4. Open Chrome and navigate to chrome://extensions/.

5. Enable Developer Mode in the top-right corner.

6. Click Load Unpacked and select the project folder.

🎨 Customization

Changing News Topics
By default, the dashboard fetches news related to technology, science, and business. You can easily customize this by modifying the `newsUrl` variable in `index.js`:

       javascript

// Change the words after 'q=' to your preferred topics
const newsUrl = `https://newsapi.org/v2/everything?q=coding+OR+space+OR+design&...`

Changing Background Themes
To change the type of images fetched from Unsplash, update the query parameters in the background fetch call within index.js:

// Change 'nature,mountains' to 'architecture', 'travel', etc.
fetch("[https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains](https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains)")

📄 License:

This project is licensed under the MIT License. See the LICENSE file for details.

👩‍💻 Author:

Ana Sappia Rey Web App Developer
