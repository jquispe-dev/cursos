# Desafío: Sesión 6

Agregar rate limiting en nginx para proteger el gateway contra ráfagas de solicitudes.

## Descripción

Toma el stack del lab 03 y configura nginx con un límite de 10 solicitudes por segundo por IP. Las solicitudes que superen el límite deben recibir una respuesta `503`.

## Pasos sugeridos

### 1. Configurar la zona de rate limiting

Se remplaza el contenido de `nginx.conf` por:

```nginx
events {
    worker_connections 1024;
}

http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        listen 8080;

        location /api/ {
            limit_req zone=api_limit burst=5 nodelay;
            proxy_pass http://backend:5000/;
            proxy_set_header Host $host;
        }

        location / {
            proxy_pass http://frontend:80/;
        }

        location /gateway/health {
            access_log off;
            return 200 "Gateway OK\n";
            add_header Content-Type text/plain;
        }
    }
}
```

Como el desafio se desarrolla en otro directorio se ejecuta:

```shell
docker compose up -d --build

# verificar si levanto correctamente
docker compose ps
curl http://localhost:8080/api/users
```

Verificar el límite con:

```shell
for i in $(seq 1 30); do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/users &
done
wait
```

Resultado:

```shell
...
[30] 1616
200
503
200
200
200
200
200
503
503
503
503
503
503
503
503
503
[1]   Done                       curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/users
503
503
...
```

Modificar la configuración de nginx, agregando `limit_req_status 429;`:

```nginx
events {
    worker_connections 1024;
}

http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        listen 8080;
        limit_req_status 429;

        location /api/ {
            limit_req zone=api_limit burst=5 nodelay;
            proxy_pass http://backend:5000/;
            proxy_set_header Host $host;
        }

        location / {
            proxy_pass http://frontend:80/;
        }

        location /gateway/health {
            access_log off;
            return 200 "Gateway OK\n";
            add_header Content-Type text/plain;
        }
    }
}
```

Recargar

```bash
docker compose exec gateway nginx -t
docker compose exec gateway nginx -s reload
```

Verificar el límite:

```shell
...
[26] 1945
200
429
200
200
429
200
200
200
[27] 1946
[28] 1947
[29] 1948
429
[30] 1949
[3]   Done                       curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/users
...
```

Revisar `limiting requests` en los logs del gateway:

```shell
...
gateway-1  | 2026/06/13 22:39:17 [error] 43#43: *64 limiting requests, excess: 5.320 by zone "api_limit", client: 172.18.0.1, server: , request: "GET /api/users HTTP/1.1", host: "localhost:8080"
...
```

## Criterio de éxito

- Las primeras solicitudes responden `200`.
- Las solicitudes que superan el límite reciben `503`.
- `docker compose logs gateway` muestra entradas con `limiting requests`.
- Después de esperar 1 segundo, las solicitudes vuelven a responder `200`.

## Pistas

- El parámetro `burst` permite que solicitudes en ráfaga no sean rechazadas de inmediato. Si querés un rechazo más agresivo, reducí `burst` a `0` o eliminá el parámetro.
- nginx devuelve `503` por defecto cuando se supera el límite. Podés cambiarlo a `429` con `limit_req_status 429;` en el bloque `server`.
- La zona de memoria `10m` puede almacenar el estado de aproximadamente 160,000 IPs. Para un lab local es más que suficiente.
