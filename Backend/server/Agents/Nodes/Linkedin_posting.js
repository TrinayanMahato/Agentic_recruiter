const { ChatOpenAI } = require("@langchain/openai");
const { linkedinPostPrompt } = require("../components/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers"); // New Parser

// Existing parsers...

// Initialize the model
const llm = new ChatOpenAI({ 
    modelName: "gpt-4o-mini", 
    temperature: 0.7 // Higher temperature for more natural social media writing
});

const linkedinPostNode = async (state) => {
    console.log("--- Generating and Posting to LinkedIn ---");

    // 1. Get JD text and Apply Link from state
    const fullJdText = state.jdText; 
    const applyLink = "https://your-career-portal.com/apply"; // Change to your real URL

    if (!fullJdText) {
        console.error("❌ No JD text found in state for LinkedIn post.");
        return state; 
    }

    try {
        // 2. Generate Content using the Prompt from prompts.js
        const parser = new StringOutputParser();
        const chain = linkedinPostPrompt.pipe(llm).pipe(parser);
        const response = await chain.invoke({ 
            jd_content: fullJdText 
        });

        // 3. Append the real link to the end of the AI's content
        const finalPostContent = `${response}\n\n🔗 Apply here: ${applyLink}`;

        // 4. Official LinkedIn API Call
        const linkedinResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify({
                "author": `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": { "text": finalPostContent },
                        "shareMediaCategory": "NONE"
                    }
                },
                "visibility": { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
            })
        });

        if (!linkedinResponse.ok) {
            const errorData = await linkedinResponse.json();
            throw new Error(`LinkedIn API Error: ${JSON.stringify(errorData)}`);
        }

        console.log("✅ Successfully posted to LinkedIn!");

        // 5. Update state to reflect the post is live
        return { 
            linkedinPostStatus: "Live" 
        };

    } catch (error) {
        console.error("❌ LinkedIn Node Error:", error);
        throw error; // Let LangGraph handle the retry logic if needed
    }
};

module.exports = linkedinPostNode;