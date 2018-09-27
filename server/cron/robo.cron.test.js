const cron = require('cron');
const axios = require('axios');

var roboCron = new cron.CronJob({
    cronTime: '0 */1 * * * *',
    onTick: async function() {
      console.log('time for cron job running', new Date(Date.now()))      
    },
    start: false,
    timeZone: 'Asia/Jakarta'
  });
  
  roboCron.start(); // job 1 started
   
  console.log('roboCron status', roboCron.running); // job1 status true