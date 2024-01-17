To generate SSL certificates for local development with HTTPS:

1. Install `mkcert`
```
sudo apt install libnss3-tools

curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert

mkcert -install
```

2. And generate keys
`mkcert localhost 127.0.0.1 ::1`

3. Install django app:
`pip install django-sslserver`

4. And then run secure development server:
`python manage.py runsslserver --certificate localhost+2.pem --key localhost+2-key.pem`