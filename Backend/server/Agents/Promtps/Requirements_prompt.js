const { PromptTemplate } = require("@langchain/core/prompts");

// Define the JD Extraction Prompt
const jdExtractionPrompt = PromptTemplate.fromTemplate(`
    Analyze the following Job Description PDF text.
    Extract exactly 5 essential technical requirements (languages, frameworks, or tools).
    Return them only as a comma-separated list.
    
    JD TEXT:
    {jd_content}
    
    TOP 5 REQUIREMENTS:
`);

// You can add more prompts here later for matching or scheduling
module.exports = {
    jdExtractionPrompt
};