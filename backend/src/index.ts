import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { scrapeWebsite } from './services/scraper';
import { analyzeBrand, generateCarouselContent, generateImage, refineBrandIdentity, refineCarouselContent, refineImagePrompt } from './services/gemini';



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Analyze endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
    try {
        const { url, description } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        console.log(`Analyzing: ${url} with context: ${description ? 'Yes' : 'No'}`);
        const scrapedData = await scrapeWebsite(url);
        const analysis = await analyzeBrand(scrapedData, description);

        res.json({
            success: true,
            scraped_data: {
                title: scrapedData.title,
                images_count: scrapedData.imageUrls.length,
                colors_count: scrapedData.cssColors.length
            },
            analysis
        });
    } catch (error: any) {
        console.error('Analysis failed:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Analysis failed'
        });
    }
});

// Generate (Strategy) endpoint
app.post('/api/generate-content', async (req: Request, res: Response) => {
    try {
        const { brand_identity, topic } = req.body;
        if (!brand_identity) {
            return res.status(400).json({ error: 'Brand identity is required' });
        }

        console.log(`Generating content for topic: ${topic || 'General'}`);
        const content = await generateCarouselContent(brand_identity, topic);

        res.json({
            success: true,
            content
        });
    } catch (error: any) {
        console.error('Content generation failed:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Content generation failed'
        });
    }
});

// Image Generation endpoint
app.post('/api/generate-image', async (req: Request, res: Response) => {
    try {
        const { prompt, aspect_ratio } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const imageBase64 = await generateImage(prompt, aspect_ratio || '4:5');

        res.json({
            success: true,
            image: `data:image/png;base64,${imageBase64}`
        });
    } catch (error: any) {
        console.error('Image generation failed:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Image generation failed'
        });
    }
});

// Refine Identity Endpoint
app.post('/api/refine-identity', async (req: Request, res: Response) => {
    try {
        const { current_identity, feedback } = req.body;
        if (!current_identity || !feedback) {
            return res.status(400).json({ error: 'Identity and feedback are required' });
        }

        const refinedIdentity = await refineBrandIdentity(current_identity, feedback);
        res.json({ success: true, refined_identity: refinedIdentity });
    } catch (error: any) {
        console.error('Identity refinement failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Refine Plan Endpoint
app.post('/api/refine-plan', async (req: Request, res: Response) => {
    try {
        const { current_plan, feedback } = req.body;
        if (!current_plan || !feedback) {
            return res.status(400).json({ error: 'Plan and feedback are required' });
        }

        const refinedPlan = await refineCarouselContent(current_plan, feedback);
        res.json({ success: true, refined_plan: refinedPlan });
    } catch (error: any) {
        console.error('Plan refinement failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Refine Image Prompt Endpoint
app.post('/api/refine-image-prompt', async (req: Request, res: Response) => {
    try {
        const { slide, feedback, brand_identity } = req.body;
        if (!slide || !feedback || !brand_identity) {
            return res.status(400).json({ error: 'Slide, feedback, and brand identity are required' });
        }

        const result = await refineImagePrompt(slide, feedback, brand_identity);
        res.json({ success: true, new_prompt: result.new_image_generation_prompt });
    } catch (error: any) {
        console.error('Image prompt refinement failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
});
