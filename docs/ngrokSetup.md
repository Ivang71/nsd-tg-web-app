 Backend: 
```bash
ngrok http 8000
``` 

 Frontend: 
```bash
ssh -R succub:80:localhost:3000 serveo.net
```

Url to set telegram webhook:
 ```
 https://api.telegram.org/bot{my_bot_token}/setWebhook?url=
 ```

