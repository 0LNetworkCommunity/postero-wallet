import { PlatformSvgCleanerService } from "@postero/mobile-backend";

class ReactNativeSvgCleanerService implements PlatformSvgCleanerService {
  public clean(svgImg: string): string {
    return svgImg;
  }
}

export default ReactNativeSvgCleanerService;
