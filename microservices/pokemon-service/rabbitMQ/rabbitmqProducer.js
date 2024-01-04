const amqp = require("amqplib/callback_api");

function sendRabbitmqMessage(queue, msg) {
  amqp.connect("amqp://rabbitmq:5672", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
      console.log(" [x] Sent %s", msg);
    });
  });
}

module.exports = { sendRabbitmqMessage };