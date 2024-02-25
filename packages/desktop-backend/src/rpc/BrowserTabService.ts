import { Injectable } from "@nestjs/common";
import { IBrowserTab, IBrowserTabService } from "./interfaces";

@Injectable()
class BrowserTabService implements IBrowserTabService {
  private tabs = new Map<string, IBrowserTab>();

  public registerTab(tab: IBrowserTab) {
    this.tabs.set(tab.getId(), tab);
    tab.onClose((tab: IBrowserTab) => this.onTabClose(tab));
  }

  public async getTabs(): Promise<IBrowserTab[]> {
    return Array.from(this.tabs.values());
  }

  private onTabClose(tab: IBrowserTab) {
    this.tabs.delete(tab.getId());
  }
}

export default BrowserTabService;
