const fs = require('fs');
const pdf = require('pdf-parse'); // Ensure you npm install pdf-parse
const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { jdExtractionPrompt } = require("../components/prompts");
const { CommaSeparatedListOutputParser } = require("@langchain/core/output_parsers");

// Initialize the cheap, efficient models
const llm = new ChatOpenAI({ 
    modelName: "gpt-4o-mini", 
    temperature: 0 
});

const extractingRequirementsNode = async (state) => {
    console.log("--- Executing Requirement Extraction Node ---");

    // 1. Get JD path from state
    const filePath = state.jdLink;
    if (!filePath) throw new Error("No JD link found in state");
    

    const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const jdText = data.text;

    const parser = new CommaSeparatedListOutputParser();

    // 4. Chain and Invoke
    const chain =jdExtractionPrompt.pipe(llm).pipe(parser);
    const response = await chain.invoke({ jd_content: jdText,format_instructions: parser.getFormatInstructions() });

    // 6. Return updated state
    return { 
        topRequirements: response 
    };
};

module.exports = extractingRequirementsNode;