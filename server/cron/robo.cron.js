require('dotenv').config()
const cron = require('cron');
const axios = require('axios');

var roboCron = new cron.CronJob({
    cronTime: '0 */60 0-23 * * *',
    onTick: async function() {
      console.log(`Executing Robocron at ${new Date(Date.now())}`)

      await axios.get('http://localhost:5000/robo/homepagelike')
        .then(result => {
            console.log('Robocron Successful:', result.message)
        })
        .catch(err => {
            console.log('Error Robocron Hompagelike', err)
        })

      await axios.get('http://localhost:5000/robo/activitylike')
        .then(result => {
            console.log('Robocron Successful:', result.message)
        })
        .catch(err => {
            console.log('Error Robocron Activitilike', err)
        })

      await axios.get('http://localhost:5000/robo/discoverylike')
        .then(result => {
            console.log('Robocron Successful:', result.message)
        })
        .catch(err => {
            console.log('Error Robocron Discoverylike', err)
        })
      
      await axios.get('http://localhost:5000/robo/hashtaglike')
        .then(result => {
            console.log('Robocron Successful:', result.message)
        })
        .catch(err => {
            console.log('Error Robocron Hashtaglike', err)
        })

    },
    start: false,
    timeZone: 'Asia/Jakarta'
  });
  
  roboCron.start(); // job 1 started
   
  console.log(`Robocron status`, roboCron.running); // job1 status true