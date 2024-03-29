import { Injectable } from "@nestjs/common";
import {
  IBrowserBridge,
} from "@postero/mobile-backend";

@Injectable()
class ReactNativeBrowserBridge implements IBrowserBridge {

}

export default ReactNativeBrowserBridge;
