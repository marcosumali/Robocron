require('dotenv').config()
const cron = require('cron');
const axios = require('axios');

var roboCron = new cron.CronJob({
    cronTime: '0 0 * * * *',
    onTick: async function() {
      console.log(`Executing Robocron at ${new Date(Date.now())}`)
     
      await axios.get('http://35.198.255.143/robo/hashtaglike')
        .then(result => {
            console.log('Robocron Successful Hashtaglike')
        })
        .catch(err => {
            console.log('Error Robocron Hashtaglike')
        })

    },
    start: false,
    timeZone: 'Asia/Jakarta'
  });
  
  roboCron.start(); // job 1 started
   
  console.log(`Robocron status`, roboCron.running); // job1 status true