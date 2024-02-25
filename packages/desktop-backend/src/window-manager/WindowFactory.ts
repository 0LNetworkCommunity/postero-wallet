import { Inject, Injectable } from "@nestjs/common";
import { IWindow, IWindowFactory } from "./interfaces";
import { ModuleRef } from "@nestjs/core";
import { Types } from "../types";
import { WindowType } from "./types";

@Injectable()
class WindowFactory implements IWindowFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createWindow(
    type: WindowType,
    params?: any,
    parent?: IWindow,
  ): Promise<IWindow> {
    const window = await this.moduleRef.resolve<IWindow>(Types.IWindow);
    await window.init(type, params, parent);
    return window;
  }
}

export default WindowFactory;
