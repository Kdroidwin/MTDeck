import { TouchManager } from "./touch";
import { insertStyle } from "./utils";
import { Deck } from "./deck";

export class AppContainerCustomizer {
  $appContainer: HTMLDivElement = document.querySelector<HTMLDivElement>("div.app-columns-container")!;
  bodyClassList = document.body.classList;

  public doCustomize(mtd: Deck): void {
    const configShowAbsoluteTime = this.bodyClassList.contains("mtdeck-show-absolute-time");
    const configShowExpander = this.bodyClassList.contains("mtdeck-show-expander");
    const configEnableSwipeCol = this.bodyClassList.contains("mtdeck-enable-swipe-col");

    // Enable Swipe Navigation in Columns
    if (configEnableSwipeCol) {
      this.enableSwipeNavCol(mtd);
    }

    // Observer new post
    const onNewPostGenerated = () => {
      if (configShowExpander) new TweetExpander().addExpandTweetButton();
      if (configShowAbsoluteTime) new AbsoluteTimeFormatter().updateTweetTimestamps();
    };
    const config = { childList: true, attributes: false, characterData: false, subtree: true };
    new MutationObserver(onNewPostGenerated).observe(this.$appContainer, config);
  }

  private enableSwipeNavCol(mtd: Deck) {
    const touchManager = new TouchManager(this.$appContainer);
    touchManager.onSwipe = (startX, direction) => {
      // console.log(direction);
      mtd.update();
      const navButtons = document.querySelectorAll<HTMLAnchorElement>("a.column-nav-link");
      navButtons.forEach((nav) => nav.classList.remove("is-selected"));
      let targetColIndex = direction == "left" ? mtd.columnIndex + 1 : mtd.columnIndex - 1;
      // console.log(`current=${mtd.columnIndex} target=${targetColumnIndex} result=${(navButtons.length + targetColumnIndex) % navButtons.length}`);
      targetColIndex = Math.min(navButtons.length - 1, Math.max(0, targetColIndex));
      navButtons[targetColIndex].click();
      navButtons[targetColIndex].classList.add("is-selected");
    };
  }
}

class TweetExpander {
  public addExpandTweetButton(): void {
    const $articles = document.querySelectorAll("article.js-stream-item");
    $articles.forEach(($article) => {
      const $tweetText = $article.querySelector(".js-tweet-text");
      const statusUrl = $article.querySelector("span.tweet-action[href]")?.getAttribute("href");
      if ($tweetText !== null && statusUrl !== null) {
        if ($tweetText.textContent?.endsWith("…") && $tweetText.childNodes[$tweetText.childNodes.length - 1].nodeType == Node.TEXT_NODE) {
          const id = $article.getAttribute("data-tweet-id");
          // OTD が実装している expandTweet() を呼び出す
          $tweetText.innerHTML += `&nbsp;<a class="expand-tweet" href="${statusUrl}" onclick="expandTweet(event, '${id}')">Expand tweet</a>`;
        }
      }
    });
  }
}

class AbsoluteTimeFormatter {
  public updateTweetTimestamps(): void {
    const $tweetTimestamps = document.querySelectorAll<HTMLTimeElement>("time.tweet-timestamp:not([data-msecdeck=done])");
    if ($tweetTimestamps.length) {
      for (const $time of $tweetTimestamps) {
        $time.classList.remove("js-timestamp");
        $time.dataset.msecdeck = "done";
        const $timeContent = $time.firstElementChild;
        if ($timeContent === null) continue;

        const timestampInSeconds = Number(
          $timeContent.getAttribute("href")?.split("/")[5] || $time.dataset.time || $timeContent.textContent?.replace(/(am|pm)\s·/, " $1")
        );
        if (timestampInSeconds != 0) {
          const formattedTime = this.formatTime(this.getDateFromSnowflake(timestampInSeconds));
          const origTextPart = ` (${$timeContent.textContent})`;
          $timeContent.textContent = `${formattedTime}${origTextPart.length > 8 ? "" : origTextPart}`;
        }
        // RT なら RT 日時も表示する
        const $article: HTMLElement | null = $time.closest("article[data-key][data-tweet-id");
        if ($article !== null && $article.getAttribute("data-key") != $article.getAttribute("data-tweet-id")) {
          this.showRtTimestamp($article);
        }
      }
    }
  }

  private showRtTimestamp($article: HTMLElement): void {
    const dataKey = $article.getAttribute("data-key");
    const dataTweetId = $article.getAttribute("data-tweet-id");
    if (dataKey && /^[0-9]+$/.test(dataKey) && dataKey != dataTweetId) {
      const rtDate = this.getDateFromSnowflake(Number(dataKey)); // dataKey が RT 本体、dataTweetId が RT 元のポスト
      const $rtArea = $article.querySelector<HTMLDivElement>("div.nbfc");
      if (rtDate && $rtArea && $rtArea.textContent) {
        $rtArea.textContent = $rtArea.textContent.replace(/Retweeted +/, `Retweeted at ${this.formatTime(rtDate)}`);
      }
    }
  }

  private getDateFromSnowflake(timestamp: number): Date {
    const epochMilliseconds: number = Math.floor(timestamp / 4194304) + 1288834974657;
    return new Date(epochMilliseconds);
  }

  private formatTime(time: Date, includeDayOfWeek: boolean = true): string {
    const pad = (num: number, size: number) => num.toString().padStart(size, "0");
    const dayOfWeek = includeDayOfWeek ? `(${["日", "月", "火", "水", "木", "金", "土"][time.getDay()]}) ` : "";
    const yearPart = new Date().getFullYear() != time.getFullYear() ? `${time.getFullYear()}/` : "";
    const datePart = `${time.getDate()}${dayOfWeek}`;
    const timePart = `${time.getHours()}:${pad(time.getMinutes(), 2)}`;
    const dateString = `${yearPart}${datePart} ${timePart}`;
    return dateString;
  }
}

export class MediaPanelCustomizer {
  $mediaPanel = document.querySelector<HTMLDivElement>("div#open-modal")!;
  bodyClassList = document.body.classList;

  public doCustomize(): void {
    const configEnableSwipeMedia = this.bodyClassList.contains("mtdeck-enable-swipe-media");
    const configMoveCloseMediaButton = this.bodyClassList.contains("mtdeck-move-close-media-button");
    if (configEnableSwipeMedia) {
      this.enableSwipeNavMedia();
    }
    if (configMoveCloseMediaButton) {
      this.moveCloseMediaButton();
    }
  }

  private enableSwipeNavMedia(): void {
    const touchManager = new TouchManager(this.$mediaPanel);
    touchManager.onSwipe = (startX, direction) => {
      // console.log(direction);
      switch (direction) {
        case "left":
          document.querySelector<HTMLAnchorElement>("a.js-media-gallery-next")?.click();
          break;
        case "right":
          document.querySelector<HTMLAnchorElement>("a.js-media-gallery-prev")?.click();
          break;
      }
    };
  }

  private moveCloseMediaButton(): void {
    insertStyle(`
    a.mdl-dismiss {
      top: unset !important;
      right: unset !important;
      bottom: 10px;
      left: 10px;}
      `);
  }
}
