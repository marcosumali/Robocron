require('dotenv').config()
const cron = require('cron');
const axios = require('axios');

var roboCron = new cron.CronJob({
    cronTime: '0 35 * * * *',
    onTick: async function() {
      console.log(`Executing Robocron at ${new Date(Date.now())}`)

      await axios.get('http://35.247.191.189/robo/discoverylike')
        .then(result => {
            console.log('Robocron Successful Discoverylike')
        })
        .catch(err => {
            console.log('Error Robocron Discoverylike')
        })

    },
    start: false,
    timeZone: 'Asia/Jakarta'
  });
  
  roboCron.start(); // job 1 started
   
  console.log(`Robocron-02 status`, roboCron.running); // job1 status true