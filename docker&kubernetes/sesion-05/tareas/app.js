const express = require('express');
const redis = require('redis');
const app = express();

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
client.connect().catch(console.error);

app.get('/', async (req, res) => {
  try {
    const visitas = await client.incr('contador_visitas');
    res.send(`Visita: ${visitas}\n`);
  } catch (err) {
    res.status(503).send(`Redis no disponible: ${err.message}\n`);
  }
});

app.get('/ping', async (req, res) => {
  try {
    const pong = await client.ping();
    res.send(`Redis responde: ${pong}\n`);
  } catch (err) {
    res.status(503).send(`Redis no disponible: ${err.message}\n`);
  }
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));