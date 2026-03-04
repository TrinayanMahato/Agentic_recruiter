const { PromptTemplate } = require("@langchain/core/prompts");

// Existing JD Extraction prompts...

const linkedinPostPrompt = PromptTemplate.fromTemplate(`
    You are an expert Technical Recruiter and Social Media Manager. 
    Analyze the following Job Description (JD) and write a high-engagement LinkedIn post to attract top-tier candidates.
    
    GUIDELINES:
    - Start with a powerful hook to grab attention.
    - Summarize the role's impact and the top 3-4 exciting benefits/perks.
    - Use professional yet enthusiastic language.
    - Use relevant emojis to break up text and make it readable.
    - Include 5-8 relevant hashtags at the bottom (e.g., #hiring #softwareengineering #remote).
    - IMPORTANT: Do not include a final "Apply Here" link; I will add the official portal link manually.
    
    JOB DESCRIPTION:
    {jd_content}
    
    CRAFTED LINKEDIN POST:
`);

module.exports = {
    linkedinPostPrompt
};