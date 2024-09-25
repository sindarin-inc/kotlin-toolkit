import { Size, Insets } from "../common/types"
import { computeScale, Fit } from "../util/fit"
import { PageManager } from "./page-manager"
import { ViewportStringBuilder } from "../util/viewport"

export class DoubleAreaManager {
  private readonly metaViewport: HTMLMetaElement

  private readonly leftPage: PageManager

  private readonly rightPage: PageManager

  private fit: Fit = Fit.Contain

  private insets: Insets = { top: 0, right: 0, bottom: 0, left: 0 }

  private viewport?: Size

  private spread?: { left?: string; right?: string }

  constructor(
    leftIframe: HTMLIFrameElement,
    rightIframe: HTMLIFrameElement,
    metaViewport: HTMLMetaElement
  ) {
    const listener = {
      onIframeLoaded: () => {
        this.layout()
      },
    }
    this.leftPage = new PageManager(leftIframe, listener)
    this.rightPage = new PageManager(rightIframe, listener)
    this.metaViewport = metaViewport
  }

  loadSpread(spread: { left?: string; right?: string }) {
    this.leftPage.hide()
    this.rightPage.hide()
    this.spread = spread

    if (spread.left) {
      this.leftPage.loadPage(spread.left)
    }

    if (spread.right) {
      this.rightPage.loadPage(spread.right)
    }
  }

  setViewport(size: Size, insets: Insets) {
    if (this.viewport == size && this.insets == insets) {
      return
    }

    this.viewport = size
    this.insets = insets
    this.layout()
  }

  setFit(fit: Fit) {
    if (this.fit == fit) {
      return
    }

    this.fit = fit
    this.layout()
  }

  private layout() {
    if (
      !this.viewport ||
      (!this.leftPage.size && this.spread!.left) ||
      (!this.rightPage.size && this.spread!.right)
    ) {
      return
    }

    const leftMargins = {
      top: this.insets.top,
      right: 0,
      bottom: this.insets.bottom,
      left: this.insets.left,
    }
    this.leftPage.setMargins(leftMargins)
    const rightMargins = {
      top: this.insets.top,
      right: this.insets.right,
      bottom: this.insets.bottom,
      left: 0,
    }
    this.rightPage.setMargins(rightMargins)

    if (!this.spread!.right) {
      this.rightPage.setPlaceholder(this.leftPage.size!)
    } else if (!this.spread!.left) {
      this.leftPage.setPlaceholder(this.rightPage.size!)
    }

    const contentWidth = this.leftPage.size!.width + this.rightPage.size!.width
    const contentHeight = Math.max(
      this.leftPage.size!.height,
      this.rightPage.size!.height
    )
    const contentSize = { width: contentWidth, height: contentHeight }
    const safeDrawingSize = {
      width: this.viewport.width - this.insets.left - this.insets.right,
      height: this.viewport.height - this.insets.top - this.insets.bottom,
    }
    const scale = computeScale(this.fit, contentSize, safeDrawingSize)

    this.metaViewport.content = new ViewportStringBuilder()
      .setInitialScale(scale)
      .setMinimumScale(scale)
      .setWidth(contentWidth)
      .setHeight(contentHeight)
      .build()

    this.leftPage.show()
    this.rightPage.show()
  }
}
