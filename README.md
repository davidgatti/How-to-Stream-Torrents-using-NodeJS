# 🍿 How to stream Torrent movies using NodeJS and the HTML5 video tag

After working on the [Understanding Streams in NodeJS](https://github.com/davidgatti/Understanding-Streams-in-NodeJS) article, I moved on to [How to Stream Movies using NodeJS](https://github.com/davidgatti/How-to-Stream-Movies-using-NodeJS). Then I thought... *Can I stream a Torrent in real time*? Turns out that yes, I can! And it's surprisingly easy, thanks to the [WebTorrent](https://webtorrent.io) npm module.

And, to be honest, I'm completely blown away by this technology. I mean, the potential here is endless. I still can't believe that I didn't get it sooner. But better now than never.  ;)

# What is this repository

This repo is a tech demo/proof of concept/article showcasing what can you do using NodeJS and the WebTorrent module. This is also a good example of how powerful the idea of streams is in general. Because you'll see that even before the file is completely downloaded to the disk, we can read the chunks of data that we have. Proving that we don't need the whole thing to stream data to the client.

# Deployment

<a href="https://heroku.com/deploy?template=https://github.com/davidgatti/How-to-Stream-Torrents-using-NodeJS" target="_blank">
<img align="left" style="float: left; margin: 0 10px 0 0;" src="https://www.herokucdn.com/deploy/button.svg"></a>

Follow the instructions on the Heroku main app page, and then once the app is deployed, visit the main page. Once you do that, you should see the site, with some examples of free Magnet Hashes so you can test out the live streaming.

# Where to start

1. Visit the home page of your deployment
1. Click on one of the demo Hashes
1. You should see the Client Stats start to show some stats
1. In a moment, you should see the content of the Magnet Hash
1. Select a movie file from the Magnet Contents section
1. After few seconds, you should see the video player buffering the movie
1. It should start playing shortly

And there you have it! Proof that you are streaming a Torrent live.

# High level explanation

We know how we can stream binary files, thanks to the `.createReadStream()` method, which gives us the possibility of specifying how much data should be read by setting the starting and finishing position of the chunk that we are interested in.

With `.createReadStream()`, we don't care if the whole file is actually on the local drive, until we have the right section, we can read it and send it, while in the background the file is being constantly downloaded.

This also proves that we're actually dealing with only chunks, and are not loading the whole file into memory. If you want to learn more about streams in NodeJS, check out my previous article titled [How to Stream Movies using NodeJS](https://github.com/davidgatti/How-to-Stream-Movies-using-NodeJS).


# How to understand the code

The code is composed of two parts: We have the front-end and we have the back-end. Shocking, I know. The good part is that the front has no UI design and only two lines of CSS. You can focus on the code itself. Aside from having very detailed comments, the code is also numbered to help you follow what is happening within each step.

The back-end is similar. If you read the [How to Stream Movies using NodeJS](https://github.com/davidgatti/How-to-Stream-Movies-using-NodeJS) article first, you see only new code related to the [WebTorrent](https://webtorrent.io) module. Meaning that if you feel confused, you should check [How to Stream Movies using NodeJS](https://github.com/davidgatti/How-to-Stream-Movies-using-NodeJS) first to understand the basics of streaming videos with NodeJS.

# Other Projects

If this article/project is something you enjoy, please consider giving it a 🌟. Also check out my [GitHub account](https://github.com/davidgatti), where I have other articles and apps that you might find interesting.