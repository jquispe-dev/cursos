# Desafío: Sesión 4

Tomar la imagen que publicaste en el lab 04 de la sesión 3 y aplicar todas las técnicas de optimización de esta sesión. El resultado debe ser una imagen notablemente más pequeña, con usuario no root, y publicada en Docker Hub como versión `2.0`.

## Criterios mínimos

1. La imagen usa multi-stage build: la etapa de compilación o instalación de dependencias está separada de la imagen final.
2. La imagen base de la etapa final es `alpine`, `slim`, `distroless` o `scratch` según la tecnología.
3. El proceso corre con un usuario sin privilegios (UID mayor que 0).
4. El `Dockerfile` tiene el orden de instrucciones óptimo para la caché.
5. La imagen lleva el tag `tu-usuario/nombre-imagen:2.0` y está publicada en Docker Hub.
6. El tamaño de la versión `2.0` es menor que el de la versión `1.0`.
7. El contenedor arranca y responde correctamente con `docker run`.
8. El `Dockerfile` tiene un `.dockerignore` con al menos tres patrones relevantes.

## Forma de verificar

```warp-runnable-command
# Descargar la imagen desde Docker Hub (sin el código fuente local)
docker pull tu-usuario/nombre-imagen:2.0
docker run --rm tu-usuario/nombre-imagen:2.0

# Verificar el usuario
docker run --rm tu-usuario/nombre-imagen:2.0 whoami
docker run --rm tu-usuario/nombre-imagen:2.0 id

# Comparar tamaños
docker image ls tu-usuario/nombre-imagen
```

## Opciones de aplicación

Para el se considera la opción A: API Python con Flask

```python
# app.py
from flask import Flask
app = Flask(__name__)

@app.route("/")
def index():
    return "Sesion 4 - Optimizado con Flask\n"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

Imagen base para la etapa final: `python:3.12-alpine3.23`.

## Imagen simple

Dockerfile.v1

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY app.py .

RUN pip install --no-cache-dir flask

EXPOSE 5000

CMD ["python", "app.py"]
```

Comandos:

```shell
docker build -f Dockerfile.v1 -t python_flask:1.0-slim .
docker image ls python_flask:1.0-slim

docker run -d --name desafio04-simple -p 5000:5000 python_flask:1.0-slim
curl http://localhost:5000

docker run --rm python_flask:1.0-slim id

docker login
docker tag python_flask:1.0-slim jquispedev/python_flask:1.0-slim
docker push jquispedev/python_flask:1.0-slim
docker logout

docker stop desafio04-simple
```

## Imagen final

Dockerfile.v2

```dockerfile
# builder
FROM python:3.12-slim as builder

WORKDIR /app

COPY app.py .

RUN pip install --no-cache-dir flask

# final
FROM python:3.12-alpine3.23

RUN addgroup -S pyappgroup && adduser -S pyappuser -G pyappgroup

WORKDIR /app

COPY --from=builder /app/app.py .

RUN pip install --no-cache-dir flask

RUN chown -R pyappuser:pyappgroup /app

USER pyappuser

EXPOSE 5000

CMD ["python", "app.py"]
```

Comandos para la imagen final:

```shell
docker build -f Dockerfile.v2 -t python_flask:2.0-alpine .
docker image ls python_flask:2.0-alpine

docker run -d --name desafio04-multistage -p 5000:5000 python_flask:2.0-alpine
curl http://localhost:5000

docker run --rm python_flask:2.0-alpine id

docker login
docker tag python_flask:2.0-alpine jquispedev/python_flask:2.0-alpine
docker push jquispedev/python_flask:2.0-alpine
docker logout
```

URL repositorio Docker Hub: https://hub.docker.com/repository/docker/jquispedev/python_flask/general
