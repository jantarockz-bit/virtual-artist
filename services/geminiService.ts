
import { GoogleGenAI, Modality } from "@google/genai";

async function editImageWithPrompt(base64ImageData: string, prompt: string): Promise<string> {
    // API key is automatically sourced from `process.env.API_KEY`
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const mimeType = base64ImageData.substring(base64ImageData.indexOf(':') + 1, base64ImageData.indexOf(';'));
    const pureBase64 = base64ImageData.substring(base64ImageData.indexOf(',') + 1);

    if (!['image/png', 'image/jpeg'].includes(mimeType)) {
        throw new Error('Unsupported image format. Please use PNG or JPEG.');
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: pureBase64,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        // Find the image part in the response
        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            const base64ImageBytes = imagePart.inlineData.data;
            const generatedMimeType = imagePart.inlineData.mimeType;
            return `data:${generatedMimeType};base64,${base64ImageBytes}`;
        } else {
            // Check for safety ratings or other reasons for no image
            const safetyRatings = response.candidates?.[0]?.safetyRatings;
            if (safetyRatings?.some(rating => rating.probability !== 'NEGLIGIBLE')) {
                 throw new Error("The request was blocked by safety filters. Please try a different prompt.");
            }
            throw new Error("No image was generated. The model may not have been able to fulfill the request.");
        }
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate image. Please check the console for more details.");
    }
}

export { editImageWithPrompt };
