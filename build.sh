make build && \
cd dist && \
tar -cvf dist.tar * && \
scp dist.tar root@168.119.235.224:/var/www/mattermost/ && \
ssh root@168.119.235.224 && \
cd /var/www/mattermost/webapp/ && \
rm -rf * && \
tar -xvf dist.tar && \
rm dist.tar && \
cd ../.. && \
docker-compose down && \
docker-compose up -d
