const { StateGraph, START, END } = require("@langgraph/langgraph");
const { MemorySaver } = require("@langgraph/langgraph");

// 1. Import your Nodes
const extractJDNode = require("./Nodes/extractJDNode");
const shortlistingNode = require("./Nodes/shortlistingNode");
const sendingAdminNoti = require("./Nodes/sendingadminnoti");
const schedulingNode = require("./Nodes/schedulingNode");
const RecruiterState = require("./RecruiterState");

// 2. Initialize the Graph with your State Schema
const workflow = new StateGraph(RecruiterState)
  // Add Nodes
  .addNode("extrat_requirements", extractJDNode)
  .addNode("sending_admin_noti", sendingAdminNoti)
  .addNode("shortlisting", shortlistingNode)
  .addNode("scheduling", schedulingNode);

// 3. Define the Edges (The Flow)
workflow
  .addEdge(START, "extracting_requirements")
  .addEdge("extracting_requirements", "Linkedin_posting")
  .addEdge("Linkedin_posting", "waitingnode")
  .addEdge("waitingnode", "sendingadminnoti")
  .addEdge("sendingadminnoti", "shortlistcandidates")
  .addEdge("shortlistcandidates", "interview_scheduling")
  .addEdge("interview_scheduling", END)
  


workflow.addEdge("sending_admin_noti", "shortlisting");
workflow.addEdge("shortlisting", "scheduling");
workflow.addEdge("scheduling", END);

// 5. Compile the Graph with Persistence (Checkpointer)
const checkpointer = new MemorySaver();
const app = workflow.compile({ 
  checkpointer,
  interruptAfter: ["sendingadminnoti"] // <--- This is where the magic happens!
});

module.exports = app;