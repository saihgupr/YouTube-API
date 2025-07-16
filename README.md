# YouTube API Project

This is a simple web project that demonstrates interaction with the YouTube Data API v3.

![Screenshot](https://i.imgur.com/HXepnjC.png)

## Features

*   **Search by Channel Name:** Find YouTube channels by their name and automatically populate the Channel ID.
*   **Filter by Keyword:** Narrow down video results by searching for keywords in video titles and descriptions.
*   **Filter by Minimum Duration:** Include only videos that meet a specified minimum duration.
*   **YouTube Shorts Toggle:** Option to include or exclude YouTube Shorts from the results.
*   **Custom Sorting Options:**
    *   Newest to Oldest (default)
    *   Oldest to Newest
    *   Random
    *   Year in Title (Oldest to Newest): Sorts videos based on a four-digit year found in their title.
    *   Year in Title (Newest to Oldest): Sorts videos based on a four-digit year found in their title.
*   **Copy for iOS:** Copies the YouTube video list URL to the clipboard, which can then be used on iOS devices.
*   **Open on Desktop:** Directly opens the generated YouTube video list URL in a new browser tab for desktop viewing.
*   **Non-Intrusive Messages:** User feedback messages are displayed directly on the page without disruptive pop-ups.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/saihgupr/YouTube-API.git
    cd YouTube-API
    ```

2.  **Obtain a YouTube Data API v3 Key:**
    If you don't have one, follow the instructions [here](https://developers.google.com/youtube/v3/getting_started).

3.  **Configure your API Key:**
    Copy `config.js.example` to `config.js`:
    ```bash
    cp config.js.example config.js
    ```
    Open `config.js` and replace `'YOUR_API_KEY'` with your actual YouTube Data API v3 key.

## Usage

Open `index.html` in your web browser to use the application.