import puppeteer from 'puppeteer';

export interface ScrapedData {
    url: string;
    title: string;
    textContent: string;
    imageUrls: string[];
    cssColors: string[];
    fontFamilies: string[];
    metaDescription: string;
}

export const scrapeWebsite = async (url: string): Promise<ScrapedData> => {
    console.log(`Starting scrape for: ${url}`);
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();

        // Set a reasonable viewport
        await page.setViewport({ width: 1920, height: 1080 });

        // Navigate with timeout
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const data = await page.evaluate(() => {
            // Helper to get all text
            const textContent = document.body.innerText.slice(0, 10000); // Limit context

            // Helper to get meta tags
            const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

            // Helper to get images (filter out small icons)
            const images = Array.from(document.querySelectorAll('img'))
                .filter(img => img.width > 50 && img.height > 50)
                .map(img => img.src)
                .slice(0, 10);

            // Helper to estimate fonts and colors from computed styles of key elements
            const elementsToSample = ['h1', 'h2', 'h3', 'p', 'a', 'button', 'body'];
            const colors = new Set<string>();
            const fonts = new Set<string>();

            elementsToSample.forEach(tag => {
                const els = document.querySelectorAll(tag);
                els.forEach(el => {
                    const style = window.getComputedStyle(el);
                    colors.add(style.color);
                    colors.add(style.backgroundColor);
                    fonts.add(style.fontFamily);
                });
            });

            return {
                title: document.title,
                textContent,
                metaDescription,
                imageUrls: images,
                cssColors: Array.from(colors).slice(0, 20), // Limit
                fontFamilies: Array.from(fonts).slice(0, 10), // Limit
            };
        });

        return {
            url,
            ...data
        };

    } catch (error) {
        console.error('Scraping error:', error);
        throw new Error('Failed to scrape website');
    } finally {
        await browser.close();
    }
};
