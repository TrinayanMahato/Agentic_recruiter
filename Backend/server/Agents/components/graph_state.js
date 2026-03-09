// The State defines what data the agent "remembers" at any given point
const RecruiterState = {
  // 1. Link to the JD document (from Admin upload)
  jdLink: { value: null },

  // 2. The Unique ID from MongoDB (New)
  // This is used by the Cron Job to fetch applicant counts later
  jobId: { value: null },

  // 3. Extracted top 5 requirements from the JD
  topRequirements: { value: [] },

  // 4. Full parsed text of the JD
  // Needed for the LinkedIn post generation
  jdText: { value: null },

  // 5. Statistics or iteration tracking
  matchCount: { value: 0 },

  // 6. Shared memory for the current results
  shortlistedCandidates: { value: [] },

  // 7. Tracking the wait status for the 7-day window
  applicationStatus: { value: "OPEN" },

  // 8. Human in the loop decision flag
  reupload: { value: "no" }
};

module.exports = RecruiterState;