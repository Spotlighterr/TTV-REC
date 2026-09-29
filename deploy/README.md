# TTV-REC on the existing Cloudflare Tunnel

The static site runs in its own Nginx container on the server's existing `tncb-net` Docker network. The current `cloudflared-tncb` connector can reach it at `http://ttv-rec:80`; this does not replace or restart any existing service.

## Deploy on Debian

```sh
git clone https://github.com/Spotlighterr/TTV-REC.git ~/TTV-REC
cd ~/TTV-REC
docker compose -f deploy/docker-compose.yml up -d --build
```

For later updates:

```sh
cd ~/TTV-REC
git pull --ff-only origin main
docker compose -f deploy/docker-compose.yml up -d --build
```

The compose file expects the existing Docker network `tncb-net`. It only starts `ttv-rec-web` and does not manage the Cloudflare connector.

## Publish hostnames in Cloudflare

In **Networking → Tunnels**, open the existing `cloudflared-tncb` tunnel and add these public hostnames, using the same tunnel:

| Hostname | Service |
| --- | --- |
| `recftu.io.vn` | `http://ttv-rec:80` |
| `www.recftu.io.vn` | `http://ttv-rec:80` |

The Nginx origin redirects `www.recftu.io.vn` to `https://recftu.io.vn`. Cloudflare must manage the `recftu.io.vn` DNS zone for these tunnel routes to create the required DNS records.

Check the site origin on the server with:

```sh
docker compose -f deploy/docker-compose.yml ps
docker exec ttv-rec-web wget -qO- http://127.0.0.1/healthz
```
