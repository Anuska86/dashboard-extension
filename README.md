# dashboard-extension

![Dashboard Preview](images/screenshot.png)

Personal Dashboard Chrome Extension

A minimalist, high-performance Chrome Extension that replaces the "New Tab" page with a beautiful, data-driven dashboard. Built with vanilla JavaScript and integrated with multiple third-party APIs.

🚀 Features:

Smart Caching: Optimized performance using localStorage to cache News, Weather, and Background data. This reduces API calls, avoids rate limits, and ensures instant loading.

Intelligent Geolocation: Automatically detects your local weather, with a built-in London-fallback if location permissions are denied.

Dynamic Greetings: Context-aware greetings (Good Morning/Afternoon/Evening) that change based on your local time.

Detailed Weather Feedback: Now includes specific weather descriptions (e.g., "Scattered Clouds") alongside temperature and city data for better context.

Local Weather Assets: Weather icons are served locally from the extension package rather than external URLs, improving load times and ensuring offline availability for the UI.

Interactive Controls:

- Shuffle News: Click the headline to cycle through cached articles.

- Smart Navigation: Use Ctrl + Click (Windows) or Cmd + Click (Mac) to open the full article in a new tab.

- Dynamic Hints: Intelligent hover states that detect your Operating System to show the correct shortcut instructions.

- Force Refresh: Dedicated refresh buttons for both News and Backgrounds to bypass cache and fetch new data instantly.

- Integrated Search: A centered, glassmorphism-styled Google search bar with auto-focus for immediate utility.

- Enhanced UI: Modern Glassmorphism design with backdrop-filter blur effects and a dark overlay to ensure text legibility regardless of the background brightness.

🛠️ Tech Stack:

HTML5 & CSS3 (Flexbox, CSS Variables, Glassmorphism)

Vanilla JavaScript (ES6+, Fetch API, Async/Await)

Manifest V3 Compliant: Built using the latest Chrome extension standards for improved security and performance.

Asset Accessibility: Configured web_accessible_resources to securely handle local images and sub-directory assets.

🔑 Required APIs:

To run this project, you will need to obtain free API keys from:

OpenWeatherMap API: For current weather data.

NewsAPI: For breaking news headlines.

Unsplash API: (Optional) The project uses a Scrimba proxy by default, but you can integrate your own Unsplash ID for higher rate limits.

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

⚠️ Security Note: The config.js file is included in .gitignore to prevent your private API keys from being leaked to GitHub. Never commit your actual keys to a public repository.

🎨 Customization

Changing News Topics

By default, the dashboard fetches news related to technology, science, and business. You can easily customize this by modifying the `newsUrl` variable in `index.js`:

JavaScript

// Change the words after 'q=' to your preferred topics
const newsUrl = `https://newsapi.org/v2/everything?q=coding+OR+space+OR+design&...`

Changing Background Themes
To change the type of images fetched from Unsplash, update the query parameters in the background fetch call within index.js:

// Change 'nature,mountains' to 'architecture', 'travel', etc.
fetch("[https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains](https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature,mountains)")

Customizing Weather Icons:

The extension uses a curated set of icons located in images/weather_icons/. These match the OpenWeatherMap icon codes. To use your own icons, simply replace the .png files in that folder while keeping the original filenames (e.g., 01d.png).

Customizing the Fallback Background:

To change the default image that appears while the dashboard is loading, replace images/background.jpg with your own high-resolution image. To update the credit for your local image, modify the setInitialFallback() function in index.js.

Managing Cache Settings

The extension is set to refresh News/Weather every 30 minutes and Backgrounds every 2 hours to stay within API free-tier limits. You can adjust the expiry variables in index.js to change these intervals:

JavaScript

const expiry = 30 _ 60 _ 1000; // Change '30' to your preferred minutes

Search Bar Target By default, the search opens in a new tab (target="\_blank") to keep your dashboard open. To change this to the same tab, remove the target attribute from the <form> tag in index.html.

📄 License:

This project is licensed under the MIT License. See the LICENSE file for details.

👩‍💻 Author:

Ana Sappia Rey Web App Developer
