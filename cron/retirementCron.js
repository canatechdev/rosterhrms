const cron = require("node-cron");
const zpService = require("../services/zp/zp.service");

cron.schedule("* * * * *", async () => {
    console.log("Running Auto Retirement Cron...");

    try {
        const result = await zpService.retireEmployeesForAllZPs();
if(result && result.length > 0 ){
    console.log(`Retired ${result.length} employees:`,result);
}
        console.log("Cron Result:", result);
    
    } catch (err) {
        console.error("Cron Error:", err.message);
    }
});