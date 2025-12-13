// Simplified scraper for serverless environments (no Puppeteer)
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
    console.log(`Starting lightweight scrape for: ${url}`);

    try {
        // Fetch HTML content
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract meta description
        const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

        // Extract text content (remove scripts, styles, and HTML tags)
        let textContent = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 10000);

        // Extract image URLs
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
        const imageUrls: string[] = [];
        let imgMatch;
        while ((imgMatch = imgRegex.exec(html)) !== null && imageUrls.length < 10) {
            const imgUrl = imgMatch[1];
            if (imgUrl.startsWith('http') || imgUrl.startsWith('//')) {
                imageUrls.push(imgUrl.startsWith('//') ? `https:${imgUrl}` : imgUrl);
            } else if (imgUrl.startsWith('/')) {
                const urlObj = new URL(url);
                imageUrls.push(`${urlObj.origin}${imgUrl}`);
            }
        }

        // Extract some basic color hints from inline styles and CSS
        const colorRegex = /#([0-9a-f]{3}|[0-9a-f]{6})\b|rgb\([^)]+\)|rgba\([^)]+\)/gi;
        const colors = new Set<string>();
        let colorMatch;
        while ((colorMatch = colorRegex.exec(html)) !== null && colors.size < 20) {
            colors.add(colorMatch[0]);
        }

        // Extract font families
        const fontRegex = /font-family:\s*([^;}"']+)/gi;
        const fonts = new Set<string>();
        let fontMatch;
        while ((fontMatch = fontRegex.exec(html)) !== null && fonts.size < 10) {
            fonts.add(fontMatch[1].trim().split(',')[0].replace(/["']/g, ''));
        }

        return {
            url,
            title,
            textContent,
            metaDescription,
            imageUrls,
            cssColors: Array.from(colors),
            fontFamilies: Array.from(fonts).filter(f => f.length > 0)
        };

    } catch (error) {
        console.error('Scraping error:', error);
        throw new Error('Failed to scrape website');
    }
};
