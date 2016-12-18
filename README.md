# 🍿 How to Stream Torrent Movies using NodeJS and the HTML5 Video tag

After working on the [Understanding Streams in NodeJS](https://github.com/davidgatti/Understanding-Streams-in-NodeJS) article I moved to [How to Stream Movies using NodeJS](https://github.com/davidgatti/How-to-Stream-Movies-using-NodeJS) then i thought to myself, can I stream a Torrent in real time, turns out that yes you can do it and it is surprisingly easy thanks to the [WebTorrent](https://webtorrent.io) npm module for NodeJS and the browser.

I'm completely blown away by this technology, its potential and its use cases in different environments. Especially in the corporate world where you have a big work force scattered around the world. Imagine you had to deliver so internal training videos and you used the example form my previous article [How to Stream Movies using NodeJS](https://github.com/davidgatti/How-to-Stream-Movies-using-NodeJS).

You would be limited by on server delivering the content around the world. But by using the Torrent technology you could set up Torrent servers in different continents and deliver your videos in a more reliable way.

I mean the potential hear is endless. I guess you think I'm a crazy person by no ;) but only know I realized how amazing the Torrent technology is for delivering files.

# What is this repository

This repo is a tech demo slash proof of concept slash article showcasing what can you do using NodeJS by combining Streams and Pipes together.

# Where to start

The first thing would be to scroll down to the Deployment section, click the Heroku Button and deploy this demo app to so you can see what to expect. Once the app is deployed,

1. click on one of the demo Hashes, with a moment,
1. select a movie file, and you should see the `Client Stats` starting to show some stats,
1. after few seconds you should see the video player resize itself to the size of the movie,
1. and then you should see the movie being buffered.
1. After enough data will go through, the video player should start automatically playing the video.

And there you have it, proof that you are streaming a torrent live. I know that there are clients that do this already, but building this by myself and seeing this working so simply just blows me away each time.

# How to understand the code

The code is spitted in two parts: we have the front-end, and we have the back end. Shocking I know. The good part is that the front has no UI design and only two lines of CSS meaning you can focus on the code itself without the need to filter out unnecessary code. Aside from havign very detailed comments the code is numbered to help you follow what is happening within each step.

The back is similar, and if you read first the [How to Stream Movies using NodeJS](https://github.com/davidgatti/How-to-Stream-Movies-using-NodeJS) article, you see only new code related to the [WebTorrent](https://webtorrent.io) module. Meaning if you feel confused you should check this article [How to Stream Movies using NodeJS](https://github.com/davidgatti/How-to-Stream-Movies-using-NodeJS) to understand the basic of streaming videos with NodeJS.

# Deployment

<a href="https://heroku.com/deploy?template=https://github.com/davidgatti/How-to-Stream-Torrents-using-NodeJS" target="_blank">
<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://www.herokucdn.com/deploy/button.svg"></a>

# Other Projects

If this article/project is something you enjoy, please consider giving it a 🌟. Also check out my [GitHub account](https://github.com/davidgatti), where I have other articles and apps that you might find interesting.