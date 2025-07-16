document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const CHANNEL_ID_INPUT = document.getElementById('channelId');
    const ORDER_SELECT = document.getElementById('order');
    const GET_VIDEOS_BTN = document.getElementById('getVideosBtn');
    const VIDEO_IDS_TEXTAREA = document.getElementById('videoIds');
    const LOADING_DIV = document.getElementById('loading');

    if (!GET_VIDEOS_BTN) {
        console.error('Could not find the "Get Video IDs" button.');
        return;
    }

    GET_VIDEOS_BTN.addEventListener('click', async () => {
        console.log('Get Videos button clicked.');

        const apiKey = YOUTUBE_API_KEY;
        const channelId = CHANNEL_ID_INPUT.value;
        const order = ORDER_SELECT.value;

        if (!apiKey || !channelId) {
            alert('Please enter both an API key and a channel ID.');
            console.warn('API Key or Channel ID is missing.');
            return;
        }

        console.log('API Key and Channel ID found. Starting fetch...');
        LOADING_DIV.style.display = 'block';
        VIDEO_IDS_TEXTAREA.value = '';

        try {
            // 1. Get the uploads playlist ID from the channel ID
            const channelApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
            console.log('Fetching channel data from:', channelApiUrl);
            const channelResponse = await fetch(channelApiUrl);
            const channelData = await channelResponse.json();
            console.log('Channel data received:', channelData);

            if (!channelData.items || channelData.items.length === 0) {
                throw new Error('Could not find channel. Check the Channel ID and API Key.');
            }

            const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
            console.log('Uploads Playlist ID:', uploadsPlaylistId);

            // 2. Fetch all video IDs from the uploads playlist
            let allVideoIds = [];
            let nextPageToken = '';

            while (true) {
                const playlistApiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`;
                console.log('Fetching playlist page from:', playlistApiUrl);
                const playlistResponse = await fetch(playlistApiUrl);
                const playlistData = await playlistResponse.json();
                console.log('Playlist data received:', playlistData);

                if (!playlistData.items) {
                    throw new Error('Error fetching playlist items. Check API key permissions.');
                }

                const videoIds = playlistData.items.map(item => item.contentDetails.videoId);
                allVideoIds.push(...videoIds);

                nextPageToken = playlistData.nextPageToken;
                if (!nextPageToken) {
                    console.log('All pages fetched.');
                    break;
                }
                console.log('Next page token:', nextPageToken);
            }

            // 3. Fetch video details to filter by duration
            console.log('Fetching video details for duration filtering...');
            let filteredVideoIds = [];
            for (let i = 0; i < allVideoIds.length; i += 50) {
                const videoIdChunk = allVideoIds.slice(i, i + 50);
                const videoDetailsApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIdChunk.join(',')}&key=${apiKey}`;
                console.log('Fetching video details from:', videoDetailsApiUrl);
                const videoDetailsResponse = await fetch(videoDetailsApiUrl);
                const videoDetailsData = await videoDetailsResponse.json();
                console.log('Video details received:', videoDetailsData);

                const longVideos = videoDetailsData.items.filter(item => {
                    const duration = item.contentDetails.duration;
                    const match = duration.match(/PT(\d+M)?(\d+S)?/);
                    const minutes = (parseInt(match[1]) || 0);
                    const seconds = (parseInt(match[2]) || 0);
                    return (minutes * 60 + seconds) > 60;
                }).map(item => item.id);

                filteredVideoIds.push(...longVideos);
            }

            // 4. Sort the video IDs if requested
            if (order === 'date_asc') {
                console.log('Sorting videos oldest to newest.');
                filteredVideoIds.reverse();
            } else if (order === 'random') {
                console.log('Shuffling videos randomly.');
                for (let i = filteredVideoIds.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [filteredVideoIds[i], filteredVideoIds[j]] = [filteredVideoIds[j], filteredVideoIds[i]];
                }
            }

            console.log('Total videos found:', filteredVideoIds.length);
            VIDEO_IDS_TEXTAREA.value = filteredVideoIds.join(',');

        } catch (error) {
            console.error('An error occurred during the fetch process:', error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            console.log('Process finished.');
            LOADING_DIV.style.display = 'none';
        }
    });
});