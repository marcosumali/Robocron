# Robocron
Robocron is a server-based automation tools robot that is designed for automatically liking post on instagram based on targeted hastags, user home page, user's activity page and user discovery page. Purpose of this program is to increase followers and engagement rate on Instagram.

Tech stack: express REST-API framework, Cron job and Puppeteer.

# Prerequisites
1. ENV Files
  Env file with detail of your Instagram account.  
  INSTAEMAIL_0=xxx.xxx@gmail.com  
  INSTAPASSWORD_0=xxxxxx  

2. CSV Files
You need to prepare CSV file with your targeted hashtags and number of automated likes per hashtag.

# Server Routes
PORT must be defined at 5000.
* /robo/hashtaglike
Perform like automation tools based on reversed hashtags and number of pictures to be liked per hashtag that should be saved inside CSV files in the controller section based on your account's niche.
* /robo/homepagelike
Perform like automation tools based on pictures on your homepage up to 10 pictures.
* /robo/activitylike
Perform like automation tools based on 10 other user's activity on your page which will automatically liking 2 pictures per user.
* /robo/discoverlike
Perform like automation tools based on 10 other user on discovery page which will automatically liking 2 pictures per user.

# Remarks
Automation is limited up to certain numbers per activities because Instagram monitor unusual activities including liking pictures too much in certain minutes. Automation will be started on hourly basis using Cron Job.
