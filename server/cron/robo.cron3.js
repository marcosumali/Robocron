require('dotenv').config()
const cron = require('cron');
const axios = require('axios');

var roboCron = new cron.CronJob({
    cronTime: '0 45 * * * *',
    onTick: async function() {
      console.log(`Executing Robocron at ${new Date(Date.now())}`)

      await axios.get('http://35.247.191.189/robo/homepagelike')
        .then(result => {
            console.log('Robocron Successful Hompagelike')
        })
        .catch(err => {
            console.log('Error Robocron Hompagelike')
        })

    },
    start: false,
    timeZone: 'Asia/Jakarta'
  });
  
  roboCron.start(); // job 1 started
   
  console.log(`Robocron-03 status`, roboCron.running); // job1 status true