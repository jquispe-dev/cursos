# Desafío: Sesión 3

## El reto

Dockeriza una aplicación real en un lenguaje que uses habitualmente, publícala en Docker Hub y verifica que funciona sin el código fuente.

## Requisitos mínimos

El `Dockerfile` debe cumplir todos estos criterios:

1. **Imagen base con tag fijo**: nada de `latest`; usar una versión concreta (`python:3.12-slim`, `node:22-alpine`, `golang:1.23-alpine`, etc.).
2. **`WORKDIR` explícito**: no copiar archivos a la raíz del sistema de archivos.
3. **`.dockerignore` presente**: excluir al menos `.git`, `.env` y los directorios de dependencias locales.
4. **`RUN` combinado**: si instalas paquetes del sistema, hacerlo en un solo `RUN` con `&&` para no generar capas intermedias innecesarias.
5. **`LABEL`**: incluir al menos un metadato (`maintainer`, `version` o `description`).
6. **`EXPOSE`**: documentar el puerto de la aplicación.
7. **Forma exec en `CMD` o `ENTRYPOINT`**: nunca la forma shell.
8. **Publicada en Docker Hub**: la imagen debe poderse descargar con `docker pull tu-usuario/repositorio:tag`.

## Contenido del desafio

Estructura de archivos

```shell
.
├── Dockerfile
├── .dockerignore
├── app
│   ├── index.html
│   ├── server.py
└── desafio.md
```

Archivo Dockerfile

```dockerfile
# Imagen base
FROM python:3.12-slim

# Metadatos de la imagen
LABEL maintainer="jquispe.dev@gmail.com" \
      version="1.0.0" \
      description="Servidor web en Python para el desafio de la sesión 03 - curso docker&kubernetes"

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo del servidor
COPY app/ .

# Publicar puerto de escucha
EXPOSE 8080

# Comando para arrancar un proceso
CMD ["python", "server.py"]
```

Archivo .dockerignore

```textile
desafio.md
```

Pa el desafio 03 se selecciona la opción A: Servidor HTTP estático en Python

```python
# server.py
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

PORT = int(os.environ.get("PORT", 8080))
server = HTTPServer(("", PORT), SimpleHTTPRequestHandler)
print(f"Escuchando en :{PORT}")
server.serve_forever()
```

Sirve los archivos del directorio actual en el puerto `PORT`.

Comandos ejecutaros

```shell
docker build -t python_http_server:1.0.0 .
docker images
docker image history python_http_server:1.0.0

docker run -d --name desafio03 -p 8080:8080 python_http_server:1.0.0
docker ps -a
curl http://localhost:8080
docker logs desafio03
docker inspect desafio03

docker login
docker tag python_http_server:1.0.0 jquispedev/python_http_server:1.0.0
docker push jquispedev/python_http_server:1.0.0
docker logout

docker stop desafio03
docker rm desafio03
docker rmi python_http_server:1.0.0

docker search jquispedev/python_http_server:1.0.0

docker pull jquispedev/python_http_server:1.0.0
docker run -d --name desafio03 -p 8080:8080 jquispedev/python_http_server:1.0.0
```

URL Docke Hub https://hub.docker.com/repository/docker/jquispedev/python_http_server/general

### Criterios de éxito

- [x] `docker build` completa sin errores.
- [x] `docker run` arranca el contenedor y la aplicación responde.
- [x] `docker image history` muestra las capas del build.
- [x] `docker push` completa sin errores.
- [x] Al eliminar la imagen local y ejecutar `docker pull + docker run`, la aplicación sigue funcionando.
- [x] Ningún secreto, credencial ni archivo `.env` está incluido en la imagen (`docker run --rm imagen env` no muestra contraseñas reales).

## 
