#forever-service install heatingd -s index.js --start -r pi

pm2 start index.js  --name callforheatd -l ~/homecontrol/logs/callforheatd -- /var/lib/homecontrol/programdata/callingForHeat
pm2 save
