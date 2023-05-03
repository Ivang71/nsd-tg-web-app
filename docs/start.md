```bash
ngrok http --host-header=rewrite 8000
``` 

 Frontend: 
```bash
autossh -o ServerAliveInterval=60 -R succub:80:localhost:3000 serveo.net
```

Setting webhook:
```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=
```
