import { PlatformSvgCleanerService } from "@postero/core";

class ReactNativeSvgCleanerService implements PlatformSvgCleanerService {
  public clean(svgImg: string): string {
    return svgImg;
  }
}

export default ReactNativeSvgCleanerService;
