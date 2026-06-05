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