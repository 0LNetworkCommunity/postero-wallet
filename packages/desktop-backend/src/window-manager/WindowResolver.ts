import { Mutation, Resolver, Context, Query, Subscription } from "@nestjs/graphql";
import { dialog } from "electron";
// import Window from "./Window";
import { IWindow } from "./interfaces";
import { Repeater } from "@repeaterjs/repeater";
import { WindowEvent } from "./types";
import { AbstractWindow } from "./AbstractWindow";

@Resolver()
class WindowResolver {
  @Query((returns) => AbstractWindow)
  public async window(@Context() window: IWindow) {
    return window;
  }

  @Mutation((returns) => Boolean)
  public async closeWindow(@Context() window: IWindow) {
    window.window?.close();
    return true;
  }

  @Mutation((returns) => String, { nullable: true })
  public async pickDirectory(@Context() window: IWindow) {
    const res = await dialog.showSaveDialog(window.window!);
    if (res.canceled) {
      return null;
    }
    return res.filePath || null;
  }

  @Subscription((returns) => AbstractWindow)
  public windowUpdated(
    @Context() window: IWindow
  ) {
    return new Repeater(async (push, stop) => {
      const release = window.on(
        WindowEvent.Updated,
        async () => {
          push({
            windowUpdated: window,
          });
        },
      );
      await stop;
      release();
    });
  }
}

export default WindowResolver;
