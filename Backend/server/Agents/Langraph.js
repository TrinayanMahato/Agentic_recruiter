const { StateGraph, START, END } = require("@langchain/langgraph");
const { MemorySaver } = require("@langchain/langgraph");

// 1. Import all Nodes (names match the actual exported files)
const extractingRequirementsNode = require("./Nodes/extracting_requirements");
const embeddingRequirementsNode = require("./Nodes/Embedding_of_requirements");
const linkedinPostNode = require("./Nodes/Linkedin_posting");
const waitingNode = require("./Nodes/Waitingnode");
const sendingAdminNoti = require("./Nodes/sendingadminnoti");
const shortlistingNode = require("./Nodes/shortlistcandidates");
const schedulingNode = require("./Nodes/interview_scheduling");
const RecruiterState = require("./components/graph_state");

// 2. Initialize the Graph with your State Schema
const workflow = new StateGraph(RecruiterState)
  // Add Nodes — the string key is what edges will reference
  .addNode("extracting_requirements", extractingRequirementsNode)
  .addNode("embedding_requirements", embeddingRequirementsNode)
  .addNode("linkedin_posting", linkedinPostNode)
  .addNode("waitingnode", waitingNode)
  .addNode("sending_admin_noti", sendingAdminNoti)
  .addNode("shortlist_candidates", shortlistingNode)
  .addNode("interview_scheduling", schedulingNode);

// 3. Define the Edges (The Flow)
workflow
  .addEdge(START, "extracting_requirements")
  .addEdge("extracting_requirements", "embedding_requirements")
  .addEdge("embedding_requirements", "linkedin_posting")
  .addEdge("linkedin_posting", "waitingnode")
  .addEdge("waitingnode", "sending_admin_noti")
  .addEdge("sending_admin_noti", "shortlist_candidates")   // Graph pauses HERE (interruptAfter)
  .addEdge("shortlist_candidates", "interview_scheduling")
  .addEdge("interview_scheduling", END);

// 4. Compile the Graph with Persistence (Checkpointer)
// interruptAfter "sending_admin_noti" means the graph pauses after notifying the admin
// and waits for the admin to manually call /api/admin/shortlist to resume.
const checkpointer = new MemorySaver();
const app = workflow.compile({
  checkpointer,
  interruptAfter: ["sending_admin_noti"],
});

module.exports = app;