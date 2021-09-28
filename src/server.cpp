#include "server.hpp"

#include "game.hpp"
#include <thread>

namespace Server
{

static int PORT = 8080;

static uWS::Loop* loop;
static uWS::SSLApp* app;

static std::thread server_thread;


static void client_connect(Server::WebSocket* socket)
{
  std::cout << "Connected" << std::endl;
}

static void client_disconnect(Server::WebSocket* socket)
{
  std::cout << "Disconnected" << std::endl;
}

void run()
{
  app = new uWS::SSLApp({
    .key_file_name = "../misc/key.pem",
    .cert_file_name = "../misc/cert.pem",
    .passphrase = "1234"
  });

  // Routes
  app->ws<PerSocketData>("/*", {
    /* Settings */
    .compression = uWS::DISABLED,
    .maxPayloadLength = 16 * 1024 * 1024,
    .idleTimeout = 32,
    .maxBackpressure = 1 * 1024 * 1024,
    .closeOnBackpressureLimit = false,
    .resetIdleTimeoutOnSend = false,
    .sendPingsAutomatically = true,
    /* Handlers */
    .upgrade = nullptr,
    .open = [](WebSocket* socket) {
      socket->subscribe("broadcast");
      client_connect(socket);
    },
    .message = [](WebSocket* socket, std::string_view message, uWS::OpCode) {
      Game::client_message(socket, message);
    },
    .drain = [](WebSocket */*ws*/) {},
    .close = [](WebSocket* socket, int /*code*/, std::string_view /*message*/) {
      client_disconnect(socket);
    }
  });

  app->listen(PORT, [](auto *listen_socket) {
    if (listen_socket) {
      std::cout << "Listening on port " << PORT << std::endl;
    }
  });

  server_thread = std::thread{[](){
    loop = uWS::Loop::get();
    app->run();
  }};
}

void cleanup()
{
  delete app;
  std::cout << "Server Shut Down" << std::endl;
}

/**
 * Broadcasts a message to all connected clients
 */ 
void broadcast(std::string_view message)
{
  if (loop == nullptr)
    return;

  loop->defer([message]() {
    app->publish("broadcast", message, uWS::OpCode::BINARY);
  });
}

}