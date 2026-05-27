# Desafío: Sesión 1

## Objetivo

Explorar Docker con autonomía: elegir una imagen que te interese, ejecutarla con criterio, inspeccionar su comportamiento y documentar lo que descubres.

### 1. Elige una imagen oficial

Se selecciona la base de datos *MariaDB*.

### 2. Lee la documentación de la imagen antes de ejecutarla

En la página de Docker Hub de la imagen que elegiste, identifica:

- ¿Qué variables de entorno acepta?
  
  Se encontró las siguientes variables de entorno: 
  
  ```shell
  MARIADB_AUTO_UPGRADE
  MARIADB_ROOT_PASSWORD=my-secret-pw
  MARIADB_USER=example-user
  MARIADB_PASSWORD=my_cool_secret
  MARIADB_DATABASE=exmple-database
  MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=1
  MARIADB_RANDOM_ROOT_PASSWORD=1
  ...
  ```

- ¿En qué puerto escucha por defecto?
  
  ```shell
  PUERTO=3306
  ```

- ¿Requiere alguna configuración obligatoria para arrancar?
  
  Se requier uno de estas variables:
  
  ```shell
  MARIADB_RANDOM_ROOT_PASSWORD,
  MARIADB_ROOT_PASSWORD_HASH,
  MARIADB_ROOT_PASSWORD,
  MARIADB_ALLOW_EMPTY_ROOT_PASSWORD
  ```

### 3. Ejecuta el contenedor

Con lo que leíste, construye el comando `docker run` adecuado. El contenedor debe:

- Tener un nombre que empiece por `lab-`.
- Ejecutarse en segundo plano si el servicio lo permite.
- Tener al menos una variable de entorno configurada si la imagen lo requiere.

```bash
docker run -d \
  --name lab-01-mariadb \
  -e MARIADB_USER=umaria\
  -e MARIADB_PASSWORD=mypass \
  -e MARIADB_DATABASE=lab01db \
  -e MARIADB_ROOT_PASSWORD=root \
  mariadb:12.3.1-noble-rc
Unable to find image 'mariadb:12.3.1-noble-rc' locally
12.3.1-noble-rc: Pulling from library/mariadb
3a6941ac14a7: Pull complete 
29a0996d2ac6: Pull complete 
493a80cb1c79: Pull complete 
9ae96c853c3c: Pull complete 
c1371c940582: Pull complete 
46803998cd5c: Pull complete 
1cf36eaf6024: Pull complete 
2780a453866b: Download complete 
87f29911b3eb: Download complete 
Digest: sha256:d0e3dbb4be72f839cf6fe8fce16cb6e2cfb5cfd5a5a9fbdf7f216f30abe3ab22
Status: Downloaded newer image for mariadb:12.3.1-noble-rc
2fdaec6f3d3d40756f9f0daf899176e30766e7e467e1e71653972f5a21f9917d
```

### 4. Verifica que funciona

Usa al menos tres de los siguientes comandos para confirmar que el servicio está operativo:

```shell
docker ps --filter "name=lab-01-mariadb"
CONTAINER ID   IMAGE                     COMMAND                  CREATED         STATUS         PORTS      NAMES
2fdaec6f3d3d   mariadb:12.3.1-noble-rc   "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   3306/tcp   lab-01-mariadb
```

```shell
docker logs lab-01-mariadb
2026-05-26 02:48:20+00:00 [Note] [Entrypoint]: Entrypoint script for MariaDB Server 1:12.3.1+maria~ubu2404 started.
2026-05-26 02:48:21+00:00 [Warn] [Entrypoint]: /sys/fs/cgroup///memory.pressure not writable, functionality unavailable to MariaDB
2026-05-26 02:48:21+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
2026-05-26 02:48:21+00:00 [Note] [Entrypoint]: Entrypoint script for MariaDB Server 1:12.3.1+maria~ubu2404 started.
2026-05-26 02:48:21+00:00 [Note] [Entrypoint]: Initializing database files
2026-05-26  2:48:21 0 [Warning] mariadbd: io_uring_queue_init() failed with EPERM: sysctl kernel.io_uring_disabled has the value 2, or 1 and the user of the process is not a member of sysctl kernel.io_uring_group. (see man 2 io_uring_setup).
create_uring failed: falling back to libaio
...
2026-05-26  2:48:28 0 [Note] Plugin 'wsrep-provider' is disabled.
2026-05-26  2:48:28 0 [Note] InnoDB: Buffer pool(s) load completed at 260526  2:48:28
2026-05-26  2:48:30 0 [Note] Server socket created on IP: '0.0.0.0', port: '3306'.
2026-05-26  2:48:30 0 [Note] Server socket created on IP: '::', port: '3306'.
2026-05-26  2:48:30 0 [Note] mariadbd: Event Scheduler: Loaded 0 events
2026-05-26  2:48:30 0 [Note] mariadbd: ready for connections.
Version: '12.3.1-MariaDB-ubu2404'  socket: '/run/mysqld/mysqld.sock'  port: 3306  mariadb.org binary distribution
```

```shell
docker inspect lab-01-mariadb
[
    {
        "Id": "2fdaec6f3d3d40756f9f0daf899176e30766e7e467e1e71653972f5a21f9917d",
        "Created": "2026-05-26T02:48:19.749245453Z",
        "Path": "docker-entrypoint.sh",
        "Args": [
            "mariadbd"
        ],
...
        "Image": "sha256:d0e3dbb4be72f839cf6fe8fce16cb6e2cfb5cfd5a5a9fbdf7f216f30abe3ab22",
...
        "Mounts": [
            {
                "Type": "volume",
                "Name": "f2e802e30229ce4cd18d81678c8e67d0eb1bf4a52de916fa48348bedc9351584",
                "Source": "/var/lib/docker/volumes/f2e802e30229ce4cd18d81678c8e67d0eb1bf4a52de916fa48348bedc9351584/_data",
                "Destination": "/var/lib/mysql",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
        ],
        "Config": {
...
            "Env": [
                "MARIADB_USER=umaria",
                "MARIADB_PASSWORD=mypass",
                "MARIADB_DATABASE=lab01db",
                "MARIADB_ROOT_PASSWORD=root",
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "GOSU_VERSION=1.19",
                "LANG=C.UTF-8",
                "MARIADB_VERSION=1:12.3.1+maria~ubu2404"
            ],
...
        "NetworkSettings": {
            "SandboxID": "5735da528f686dfd49cdaf9e45c26e3b4446a1bf1f8f0f3ccc574f9972dd43a1",
            "SandboxKey": "/var/run/docker/netns/5735da528f68",
            "Ports": {
                "3306/tcp": null
            },
...
                }
            }
        },
...
]
```

```shell
docker top lab-01-mariadb
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
999                 2032                2009                0                   02:48               ?                   00:00:02            mariadbd
```

```shell
docker exec -it lab-01-mariadb bash
root@2fdaec6f3d3d:/# 
```

Otros ejemplos

```shell
docker exec -it lab-01-mariadb mariadb -u root -p
Enter password: 
Welcome o the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 3
Server version: 12.3.1-MariaDB-ubu2404 mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Help others discover MariaDB. Star it on GitHub: https://github.com/MariaDB/server

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> select version();
+------------------------+
| version()              |
+------------------------+
| 12.3.1-MariaDB-ubu2404 |
+------------------------+
1 row in set (0.000 sec)

MariaDB [(none)]> 
```

```shell
docker exec -it lab-01-mariadb mariadb -u root -proot -e "SELECT VERSION();"
+------------------------+
| VERSION()              |
+------------------------+
| 12.3.1-MariaDB-ubu2404 |
+------------------------+
```

```shell
docker exec -it lab-01-mariadb mariadb -u umaria -pmypass -e "SELECT VERSION();"
+------------------------+
| VERSION()              |
+------------------------+
| 12.3.1-MariaDB-ubu2404 |
+------------------------+
```

### 5. Responde estas preguntas

Escribe las respuestas en un archivo o en tus notas personales:

- ¿Qué tag elegiste y por qué?
  
  Use una de la versiones de **noble**, porque tiene menos vulnerabilidades.
- ¿Qué variable de entorno configuraste y qué efecto tiene?
  
  ```shell
  MARIADB_USER=usuario base de datos
  MARIADB_PASSWORD=password del usuario base de datos
  MARIADB_DATABASE=nombre de la base de datos
  MARIADB_ROOT_PASSWORD=password de usuario root
  ```
- ¿Cuál es el proceso principal del contenedor según `docker top`?
  
  Se vé un solo proceso 2032 ejecutado por el comando mariadbd.
- ¿Qué información relevante encontraste en `docker inspect` que no te da `docker ps`?
  
  Las variables de entorno.
- ¿Qué harías diferente si fuera un entorno de producción?
  
  Por ahora no se me ocurre nada... no volveria a poner el password root al usurio root.

## Limpieza

```shell
docker rm -f $(docker ps -aq --filter "name=lab-01-mariadb") 2>/dev/null || true
2fdaec6f3d3d
```