const fs = require('fs');
const path = require('path');

// Target paths
const EVENTS_FILE = path.join(__dirname, '../data/events.json');
const INSTA_FILE = path.join(__dirname, '../data/instagram.json');
const INSTA_IMG_DIR = path.join(__dirname, '../images/instagram');

// Endpoints from environment variables
const API_EVENTS_URL = process.env.API_EVENTS_URL;
const API_INSTA_URL = process.env.API_INSTA_URL;

// Ensure directories exist
fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
fs.mkdirSync(INSTA_IMG_DIR, { recursive: true });

/**
 * Downloads a file from a URL to a local destination path.
 */
async function downloadFile(url, destPath) {
    console.log(`Downloading: ${url} -> ${destPath}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download ${url}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(destPath, buffer);
}

/**
 * Normalizes and processes Calendar Events.
 * Strips etags, updated timestamps, and sorts events deterministically.
 */
async function syncEvents() {
    if (!API_EVENTS_URL) {
        console.warn('API_EVENTS_URL environment variable is not defined. Skipping events sync.');
        return;
    }

    console.log('Fetching calendar events...');
    const response = await fetch(API_EVENTS_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data = await response.json();

    // Strip top-level etag and updated timestamp
    delete data.etag;
    delete data.updated;

    if (Array.isArray(data.items)) {
        // Sort items by ID to be perfectly stable in Git
        data.items.sort((a, b) => (a.id || '').localeCompare(b.id || ''));

        // Strip dynamic noise from each item
        data.items = data.items.map(item => {
            const cleaned = { ...item };
            delete cleaned.etag;
            delete cleaned.updated;
            delete cleaned.sequence;
            return cleaned;
        });
    }

    // Write back sanitized and sorted events JSON
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('Events synced successfully.');
}

/**
 * Normalizes and processes Instagram Posts.
 * Localizes the images for the top posts, deletes unused local images,
 * and outputs clean JSON referencing local images.
 */
async function syncInstagram() {
    if (!API_INSTA_URL) {
        console.warn('API_INSTA_URL environment variable is not defined. Skipping Instagram sync.');
        return;
    }

    console.log('Fetching Instagram feed...');
    const response = await fetch(API_INSTA_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch Instagram data: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
        console.warn('Instagram data has unexpected structure. Skipping.');
        return;
    }

    // Keep the top 6 posts (site only displays top 4)
    const posts = data.data.slice(0, 6);
    const activeImageNames = new Set();

    for (const post of posts) {
        const imageUrl = post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url;
        
        if (!imageUrl) {
            console.warn(`No image URL found for post ID: ${post.id}`);
            continue;
        }

        const fileName = `${post.id}.jpg`;
        const localPath = path.join(INSTA_IMG_DIR, fileName);
        activeImageNames.add(fileName);

        // Check if image is already cached locally
        const exists = fs.existsSync(localPath);
        if (exists && fs.statSync(localPath).size > 0) {
            console.log(`Image already cached: ${fileName}`);
        } else {
            try {
                await downloadFile(imageUrl, localPath);
            } catch (err) {
                console.error(`Failed to localize image for post ${post.id}:`, err);
                // If it fails, keep the old/original image URL as a fallback
                continue;
            }
        }

        // Replace URLs with local repository paths in JSON
        post.media_url = `images/instagram/${fileName}`;
        if (post.thumbnail_url) {
            post.thumbnail_url = `images/instagram/${fileName}`;
        }
    }

    // Replace the data array in the output json
    data.data = posts;
    // Strip paging since we've sliced and localized
    delete data.paging;

    // Clean up any old images in the folder that are no longer in our active list
    if (fs.existsSync(INSTA_IMG_DIR)) {
        const files = fs.readdirSync(INSTA_IMG_DIR);
        for (const file of files) {
            if (!activeImageNames.has(file) && file.endsWith('.jpg')) {
                const oldFilePath = path.join(INSTA_IMG_DIR, file);
                console.log(`Removing old Instagram image: ${file}`);
                try {
                    fs.unlinkSync(oldFilePath);
                } catch (e) {
                    console.error(`Failed to delete ${file}:`, e);
                }
            }
        }
    }

    // Write back clean Instagram JSON
    fs.writeFileSync(INSTA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('Instagram sync completed successfully.');
}

async function main() {
    try {
        await syncEvents();
        await syncInstagram();
        console.log('Sync processing completed successfully.');
    } catch (error) {
        console.error('Error during sync processing:', error);
        process.exit(1);
    }
}

main();
