import {GoogleGenerativeAI} from "@google/generative-ai";

type FormState = {
    error?: {
        name?: string[];
        email?: string[];
        username?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    success?: boolean;
};

export default async function createChat(state: FormState, formData: FormData): Promise<FormState> {
    const message = formData.get("message") as string;
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({model: "gemini-2.0-pro-exp-02-05"});
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 1000,
        responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
        generationConfig,
        history: [],
    })

    const result = await chatSession.sendMessage(message);
    console.log(result.response.text());
}