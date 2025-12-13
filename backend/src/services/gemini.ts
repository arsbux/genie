import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { ScrapedData } from './scraper';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

// Models
const reasoningModel = process.env.MODEL_REASONING || 'gemini-pro';
const imageModel = process.env.MODEL_IMAGE || 'gemini-pro-vision';

console.log(`Using Reasoning Model: ${reasoningModel}`);

export const analyzeBrand = async (scrapedData: ScrapedData, userContext?: string) => {
  const model = genAI.getGenerativeModel({ model: reasoningModel });

  const prompt = `
    Analyze this website data and user provided context to extract a comprehensive brand identity for an Instagram carousel campaign.
    
    Website: ${scrapedData.url}
    Title: ${scrapedData.title}
    Description: ${scrapedData.metaDescription}
    
    User Provided Context (The business owner's description):
    ${userContext || "None provided."}

    Content Sample:
    ${scrapedData.textContent.slice(0, 2000)}...
    
    Detected Colors (CSS): ${scrapedData.cssColors.join(', ')}
    Detected Fonts (CSS): ${scrapedData.fontFamilies.join(', ')}
    
    Based on this, return a JSON object with the following structure (do NOT include markdown formatting or backticks, just the raw JSON):
    
    {
      "brand_identity": {
        "colors": {
          "primary": "hex code (infer main brand color)",
          "secondary": "hex code",
          "accent": "hex code",
          "background": "hex code"
        },
        "fonts": {
          "heading": "font family name",
          "body": "font family name"
        },
        "tone": "adjectives describing brand voice",
        "audience": "inferred target audience",
        "industry": "inferred industry"
      },
      "design_recommendation": {
        "style": "minimal | bold | luxury | playful",
        "description": "brief direction for visuals",
        "typography": "specific recommendations for font weights, casing, and layout on slides"
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Cleanup markdown if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error: any) {
    console.error('Gemini Analysis Error:', error);
    throw new Error(error.message || 'Failed to analyze brand data');
  }
};

export const generateCarouselContent = async (brandIdentity: any, topic?: string) => {
  const model = genAI.getGenerativeModel({ model: reasoningModel });

  const effectiveTopic = topic || "General brand awareness and value proposition";

  const prompt = `
    Create a 7-slide Instagram Carousel content plan based on this brand identity.
    
    Brand Identity:
    ${JSON.stringify(brandIdentity, null, 2)}
    
    Campaign Topic: ${effectiveTopic}
    
    Return a JSON object with this structure (no markdown):
    {
      "carousel_title": "Catchy title for the campaign",
      "slides": [
        {
          "slide_number": 1,
          "type": "hook",
          "title": "Big bold hook text",
          "body": "Subtext or caption",
          "visual_description": "Detailed description for the background image/visual",
          "image_generation_prompt": "A complete, self-contained prompt for an AI image generator. It MUST follow this structure: '[Visual Scene Description]. [Lighting/Style]. 8k resolution, highly detailed, photorealistic, masterpiece. TEXT OVERLAY: The image features the text \"[INSERT SLIDE TITLE HERE]\" in a [Font Style] font. The text should be [Position] and clearly legible.' NOTE: You MUST include the exact text from the 'title' field."
        },
        ... (continue for 5-7 slides ending with CTA)
      ]
    }

    CRITICAL INSTRUCTIONS:
    1. EVERY slide image MUST have a text overlay.
    2. The 'image_generation_prompt' must explicitly state exactly what text to render (use the slide title).
    3. Do NOT allow the image generator to hallucinate text. Give it the exact string.
    4. Ensure the visual description supports the text (e.g., 'negative space in center for text').
    5. Styling should be consistent with the Brand Identity provided.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Gemini Strategy Error:', error);
    throw new Error(error.message || 'Failed to generate carousel content');
  }
};

export const generateImage = async (prompt: string, aspectRatio: string = '1:1'): Promise<string> => {
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

  const modelName = process.env.MODEL_IMAGE || 'imagen-3.0-generate-001';

  // Check if it's an Imagen model to use the predict endpoint
  const isImagen = modelName.toLowerCase().includes('imagen');

  // Construct endpoint based on model type (for now assuming predict for image generation models in this context)
  // Even for some Gemini image generation previews, they often follow a similar pattern or use specific tools.
  // We will stick to the restore/predict pattern for Imagen.

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${apiKey}`;

  const body = {
    instances: [
      {
        prompt: prompt
      }
    ],
    parameters: {
      sampleCount: 1,
      aspectRatio: aspectRatio,
      // Attempt to request higher quality if model supports it (person_generation param is just an example of what might control quality in some versions)
      // For standard Imagen, aspect ratio determines size. 1:1 is usually 1024x1024.
      // We'll stick to 1:1.
    }
  };

  try {
    console.log(`Generating image with model: ${modelName}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image generation failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Handle Imagen response structure
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
      return data.predictions[0].bytesBase64Encoded;
    }

    // Handle potential different structure for other models (e.g. Gemini outputting image?)
    // Currently standard Gemini API 'generateContent' returns parts. 
    // If the user forces a Gemini model for image generation via REST predict, it might fail or return differently.
    // We'll log full response if structure is unexpected.

    console.error('Unexpected image response structure:', JSON.stringify(data, null, 2));
    throw new Error('No image data found in response');

  } catch (error: any) {
    console.error('Image Generation Error:', error);
    throw new Error(error.message || 'Failed to generate image');
  }
};

export const refineBrandIdentity = async (currentIdentity: any, feedback: string) => {
  const model = genAI.getGenerativeModel({ model: reasoningModel });

  const prompt = `
      Update this Brand Identity based on the user's feedback.
      
      Current Identity:
      ${JSON.stringify(currentIdentity, null, 2)}
      
      User Feedback:
      "${feedback}"
      
      Return the updated JSON object with the same structure (brand_identity, design_recommendation).
      Ensure the changes directly address the feedback while maintaining consistency in other areas.
      Do not include markdown.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Gemini Identity Refinement Error:', error);
    throw new Error(error.message || 'Failed to refine identity');
  }
};

export const refineCarouselContent = async (currentPlan: any, feedback: string) => {
  const model = genAI.getGenerativeModel({ model: reasoningModel });

  const prompt = `
      Update this Carousel Content Plan based on the user's feedback.
      
      Current Plan:
      ${JSON.stringify(currentPlan, null, 2)}
      
      User Feedback:
      "${feedback}"
      
      Return the updated JSON object with the same structure (carousel_title, slides).
      Ensure the 'image_generation_prompt' for each slide is also updated if the visual direction changes.
      Do not include markdown.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Gemini Plan Refinement Error:', error);
    throw new Error(error.message || 'Failed to refine plan');
  }
};

export const refineImagePrompt = async (slide: any, feedback: string, brandIdentity: any) => {
  const model = genAI.getGenerativeModel({ model: reasoningModel });

  // Handle both direct brand_identity and nested structure
  const style = brandIdentity?.design_recommendation?.style || brandIdentity?.style || 'modern and professional';
  const colors = brandIdentity?.brand_identity?.colors || brandIdentity?.colors || {};

  const prompt = `
      Refine the image generation prompt for this specific slide based on user feedback.
      
      Slide Context:
      Title: ${slide.title}
      Current Visual Description: ${slide.visual_description || ''}
      Current Prompt: ${slide.image_generation_prompt || ''}
      
      Brand Style: ${style}
      Brand Colors: ${JSON.stringify(colors)}
      
      User Feedback:
      "${feedback}"
      
      Return a JSON object with this structure:
      {
        "new_image_generation_prompt": "The updated prompt string..."
      }
      
      CRITICAL: The new prompt MUST still follow the rule of explicitly stating the text overlay ("${slide.title}") and include keywords for high quality (8k, photorealistic).
      Do not include markdown.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    console.log('Gemini Refine Raw Response:', text); // Debug log
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Gemini Image Prompt Refinement Error:', error);
    throw new Error(error.message || 'Failed to refine image prompt');
  }
};
