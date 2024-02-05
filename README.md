# MTDeck OldTweetDeck 対応版

TweetDeck をスマホアプリのように使えるようにする UserScript (mod by fronoske)

> [!NOTE]
> この README は主に fronoske によって改変した内容のみを掲載しています。
> オリジナル（kdroidwin 氏版）の README は [README.orig.md](https://github.com/fronoske/MTDeck_for_OTD/blob/main/README.orig.md) を参照してください。

## 使い方
UserScript本体は [releases](https://github.com/fronoske/MTDeck_for_OTD/releases) にあります。`MTDeckForOTD.min.user.js` と `MTDeckForOTD.user.js` のどちらを使っても構いません。
min の方がサイズが小さいので高速かもしれません。

その他は [README.orig.md](https://github.com/fronoske/MTDeck_for_OTD/blob/main/README.orig.md) を参照してください。


## 新機能

以下のオプションを追加した
- 絶対時刻を表示する
- スワイプで画像を切り替える
- スワイプでカラムを移動する
- 長文ツイートの場合に「Expand tweet」を表示する（OTDが対応できないケースの補完）
- 画像パネルの閉じるボタン「X」を左下に移動する
- リストカラムやユーザーカラムのタブにリスト名（ユーザー名）の頭文字を表示する


## 注意
すべての機能は非保証です。うまく機能しなかったり、通常の使用にに悪影響を与えるおそれがあります。自己責任でお使いください。
不具合が発生した場合は当該機能を無効にしたり、他のバージョンの MTDeck をお使いください。

MTDeck や OldTweetDeck は X 社が想定していない手法でサーバーにアクセスしています。そのためこれらの使用にはアカウント停止などのリスクがあることを
承知の上でお使いください。

「Expand tweet」ボタンの表示は OTD が実装済みですが、日本語ツイートの場合にときどき動作しないことがあるのでその補完のために本スクリプトでも実装しています。
最後が「…」かどうかだけで判断しているため、実際には後続のメッセージが存在しない場合もあります。


## TODO
- 画像の拡大・縮小を可能にする

## 謝辞
すばらしいスクリプトを開発された [mkizka](https://github.com/mkizka) 氏、それを OTD に対応された [Kdroidwin](https://github.com/Kdroidwin) 氏、
そして OldTweetDeck の開発者である [dimden](https://github.com/dimdenGD) 氏に深く感謝します。
