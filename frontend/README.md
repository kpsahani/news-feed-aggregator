Hi, I have use Nextjs for Frontend Development and configure with Docker.

- steps Need to Follow for run application

1. make build
docker build -t news-feed-fe-main .

2. run command for application
docker run -p 3000:3000 -d news-feed-fe-main
