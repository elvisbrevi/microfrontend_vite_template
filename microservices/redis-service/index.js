const express = require("express");
const { createClient } = require("redis");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const redisClient = createClient({ url: "redis://redis:6379" });
redisClient.connect();

app.post("/cache", async (req, res) => {
  try {
    const { cacheKey, cardInfo } = req.body;
    await redisClient.hSet(cacheKey, cardInfo);
    await redisClient.expire(cacheKey, 20);
    res.send("Cache actualizado");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al guardar en Redis");
  }
});

app.get("/cache/:key", async (req, res) => {
  try {
    const data = await redisClient.hGetAll(req.params.key);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener de Redis");
  }
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Redis Service running on port ${PORT}`));
