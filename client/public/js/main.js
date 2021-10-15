var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import run_client from "./client.js";
import Context from "./graphics/context.js";
import Renderer from "./graphics/renderer.js";
import Input from "./input.js";
import Network from "./network/socket.js";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const uiHTML = document.getElementById("game-ui");
        const context = new Context("game-canvas");
        yield Renderer.init(context);
        Input.listen(window);
        Network.init();
        run_client();
    });
}
main();
