# Desafío: Sesión 2

## El reto

Elige una imagen de Docker Hub que no hayas usado antes. No uses `nginx`, `postgres`, `redis` ni `hello-world`.

Opciones sugeridas: `redis:7-alpine`, `mysql:8.4`, `mongo:7`, `rabbitmq:3-alpine`, `httpd:alpine`.

Se selecciona `mysql:9.7.0`.

## Preguntas que debes poder responder

Antes de ejecutar la imagen:

1. ¿Qué hace esta imagen? Lee la descripción en hub.docker.com.
   
   MySQL es un sistema de gestión de bases de datos relacionales (RDBMS) de código abierto y ampliamente utilizado.

2. ¿Qué variables de entorno requiere o acepta?
   
    Variables de entorno: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ALLOW_EMPTY_PASSWORD`, ...

3. ¿En qué directorio almacena sus datos persistentes?
   
   Almacena en: `/var/lib/mysql`.

4. ¿Qué puerto expone?
   
   Puerto por defecto: `3306`.

Después de ejecutarla:

5. ¿Cuántas capas tiene? (`docker image history`)
   
   Tiene 10 capas:
   
   ```json
               "Layers": [
                   "sha256:83471d529b3dfc662ce4c626e90031a0d4017d6009b548ec0d9cf3b069089b30",
                   "sha256:44157eba0c8972e75983c49e380321f0a5ad68027253929afb4a6df9c653e4da",
                   "sha256:168c9293def7f7c56751ea556ba0efe657f28960e2192b8d381b366e7561a1e5",
                   "sha256:e3e9fce343b94c4f1ca3d7e3e0f1e919c3023c2410f2742d37039559abac94e1",
                   "sha256:7ace97f6ec443b334cd67547993bc026b4adbfbf6c9990dad71b3a6bc01bbf42",
                   "sha256:1a562c3869252a268cb71162a354cd8f79365041381c83952d4d6acf94f3ac5c",
                   "sha256:b8f2288f17301bef6fa09b4267d9b8f9704a0d5b150def59d628d45b0c792589",
                   "sha256:2ff7c758d07851d05440a1eaa4110d3cf5fe5fd304b3c0f308d433f8db6d15c5",
                   "sha256:3ee2c8654daa87659efb995e941a10df947c28cf1674e902e879142bd9d0a6f4",
                   "sha256:b7b9d349f510eed9b652ffb5f301ea8d9ccbca865df41ee3b23f17c4ec4658f2"
               ]
   ```

6. ¿Qué comando ejecuta por defecto? (`docker image inspect --format '{{.Config.Cmd}}'`)
   
   ```shell
   docker image inspect mysql:9.7.0 --format '{{.Config.Cmd}}'
   [mysqld]
   ```

7. ¿Qué procesos corren dentro? (`docker top`)
   
   El proceso es: `mysqld`.

8. ¿Qué pasa con los datos si eliminas el contenedor y lo vuelves a crear sin volumen?
   
   Los datos persisten, pero el contenedor sin el volumen tendrá los datos vacios.

9. ¿Qué pasa si lo vuelves a crear con un volumen nombrado?
   
   Los datos persistan.

## Lo que debes hacer

```shell
docker pull mysql:9.7.0
docker image inspect mysql:9.7.0
docker image history mysql:9.7.0
docker run -d \
  --name lab-desafio2 \
  -e MYSQL_ROOT_PASSWORD=adm123 \
  -e MYSQL_DATABASE=tienda \
  -e MYSQL_USER=usermysql \
  -e MYSQL_PASSWORD=mypass \
  -v datos-desafio:/var/lib/mysql \
  -p 3306:3306 \
  mysql:9.7.0
docker logs lab-desafio
docker top lab-desafio
# Prueba la persistencia:
# 1. Conecta y crea datos
# 2. Elimina el contenedor
# 3. Recrea con el mismo volumen
# 4. Verifica que los datos persisten
docker rm -f lab-desafio
docker volume rm datos-desafio
```

Pasos para la prueba de persistencia

```shell
docker exec -it lab-desafio bash

# mysql -u usermysql -p
Enter password: mypass

mysql> use tienda
Database changed

mysql> CREATE TABLE libros (id INT AUTO_INCREMENT PRIMARY KEY, descripcion TEXT);
Query OK, 0 rows affected (0.030 sec)

mysql> INSERT INTO libros (descripcion) VALUES ('Principito');
Query OK, 1 row affected (0.022 sec)

mysql> SELECT * FROM libros;
+----+-------------+
| id | descripcion |
+----+-------------+
|  1 | Principito  |
+----+-------------+
1 row in set (0.000 sec)

mysql> exit
Bye

# exit

docker stop lab-desafio
docker rm lab-desafio

docker run -d \
  --name lab-desafio2 \
  -e MYSQL_ROOT_PASSWORD=adm123 \
  -e MYSQL_DATABASE=tienda \
  -e MYSQL_USER=usermysql \
  -e MYSQL_PASSWORD=mypass \
  -v datos-desafio:/var/lib/mysql \
  -p 3306:3306 \
  mysql:9.7.0

docker exec -it lab-desafio2 bash

# mysql -u usermysql -p
Enter password: mypass

mysql> use tienda
Database changed

mysql> SELECT * FROM libros;
+----+-------------+
| id | descripcion |
+----+-------------+
|  1 | Principito  |
+----+-------------+
1 row in set (0.000 sec)

mysql> exit
Bye
# exit 
exit
```

## Criterio de éxito

Puedes describir en una oración qué hace la imagen, qué variables necesita y cómo los datos persisten con un volumen nombrado.

La imagen permite levantar una bases de datos MySQL, minimamente necesecita la variable de entorno `MYSQL_ROOT_PASSWORD`, los datos persisten porque se almacenan en un volumen fuera del contenedor.