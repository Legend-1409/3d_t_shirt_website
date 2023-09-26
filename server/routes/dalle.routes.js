import express from "express";
import * as dotenv from "dotenv";
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Hello from DALLE Routes'});
})

router.route('/').post(async (req, res) => {
    try {
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
                    "User-Agent": "Chrome",
                },
                body:JSON.stringify({
                    prompt: req.body.prompt,
                    n: 1,
                    size: "512x512",
                    response_format: 'b64_json',
                }),
            }
        )
        const responseBody = await response.json();
        const image = responseBody.data[0].b64_json;
        res.status(200).json({ photo: image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong"});
    }
});

export default router;