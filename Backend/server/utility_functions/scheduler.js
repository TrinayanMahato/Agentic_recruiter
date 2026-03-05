const { google } = require('googleapis');


const bulkScheduleSearch = async (auth, candidates) => {
    const calendar = google.calendar({ version: 'v3', auth });
    const scheduledResults = [];
    
    // Starting point: Tomorrow at 9 AM
    let searchDate = new Date();
    searchDate.setDate(searchDate.getDate() + 1);
    let currentSearchStart = new Date(searchDate.setHours(9, 0, 0, 0));

    for (const candidate of candidates) {
        let slotFound = false;

        while (!slotFound) {
            const dayEnd = new Date(currentSearchStart);
            dayEnd.setHours(17, 0, 0, 0);

            // 1. Get Busy slots for the current search day
            const check = await calendar.freebusy.query({
                resource: {
                    timeMin: currentSearchStart.toISOString(),
                    timeMax: dayEnd.toISOString(),
                    items: [{ id: 'primary' }],
                },
            });

            const busySlots = check.data.calendars.primary.busy;

            // 2. Try to find a 30-min gap in the remaining day
            while (currentSearchStart.getTime() + 30 * 60000 <= dayEnd.getTime()) {
                const potentialEnd = new Date(currentSearchStart.getTime() + 30 * 60000);

                const isBusy = busySlots.some(busy => {
                    return currentSearchStart < new Date(busy.end) && potentialEnd > new Date(busy.start);
                });

                if (!isBusy) {
                    // SLOT FOUND!
                    scheduledResults.push({
                        ...candidate,
                        startTime: new Date(currentSearchStart),
                        endTime: potentialEnd
                    });

                    // IMPORTANT: Move the start time forward so the NEXT candidate 
                    // doesn't get this same slot
                    currentSearchStart = new Date(potentialEnd.getTime() + 15 * 60000); // 15 min buffer
                    slotFound = true;
                    break;
                }

                // If busy, slide forward by 30 mins
                currentSearchStart = new Date(currentSearchStart.getTime() + 30 * 60000);
            }

            // 3. If day is over and no slot found, roll to 9 AM the next day
            if (!slotFound) {
                currentSearchStart.setDate(currentSearchStart.getDate() + 1);
                currentSearchStart.setHours(9, 0, 0, 0);
            }
        }
    }

    return scheduledResults;
};

module.exports = { bulkScheduleSearch };