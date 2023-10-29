# ATS System

[![IMAGE ALT TEXT HERE](icons/icon_128.png)](https://www.youtube.com/watch?v=yYRQEdfGjEg)

## 製品概要
### 背景(製品開発のきっかけ、課題等）

Webサービスで新しく会員登録するとき、「利用規約に同意する」というボタンを利用規約を読まずに押したことは誰しもあるのではないのでしょうか。

読まれることの少ない利用規約ですが、その内容が悪質だとして裁判を起こされた例もあります。

>モバゲー規約　一部差し止め　さいたま地裁、DeNAに
>https://www.nikkei.com/article/DGXMZO55300790V00C20A2CR8000/

**利用規約が長すぎるため、ユーザーは読むことができず、そのまま受け入れるしかない**　という課題があります。


この課題へのアプローチとして、

1\. ユーザーはその利用規約がどのような危険をはらんでいるか把握する

2\. ユーザーはそのサービス以外の選択肢を知る

という二つが有効だと考えます。

### 製品説明（具体的な製品の説明）
このプロダクトでは、利用規約の、ユーザーにとって大事になる部分を抜き出し、わかりやすく表示することを主目的とします。ユーザーにとって重要となると思われる問題が起こった時の責任の取り方や、個人情報の扱いなどを抽出し、リスト型にしてわかりやすく表示します。利用規約スキャナーズは、まず利用規約のデータベースを作るところから始まります。
また、ユーザーが気にすべきところであったり、不当な契約が書かれている可能性が存在する場合には、視覚的にわかりやすい形でユーザーに表示します。それにより、何かが起こった際の泣き寝入りを未然に防いだり、ユーザの勘違いによる被害の発生を防ぎます。

https://github.com/jphacks/TK_2312/assets/93107062/787046ef-7344-4d80-889f-77cb96c53781

### 特長
#### 1. 利用規約のうち，ユーザにとって不利になりうる情報を読みやすく抽出し，不利になりうる理由とセットで表示する機能
#### 2. 不利になる利用規約を持ったサービスであった場合に，類似するサービスをレコメンドする機能

### 解決出来ること
利用規約を読みやすくし，ユーザにとって不利な条項が含まれている利用規約が存在した場合に，ユーザが被害を被る可能性を減らすことができる．また，この製品が存在するという事実が，不当な条項を作りにくくするという社会的な効果もあると考えられる．
### 今後の展望
今回の場合，ユーザが検出したい利用規約のテキストを読み取る形式であったが，将来的には自動で利用規約のテキストを検出するような機能を実装したいと考えている．


## 開発技術
### 活用した技術
#### API・データ
* ChatGPTAPI

#### フレームワーク・ライブラリ・モジュール
* Chrome extention
* Javascript
* jQuery
* HTML
* UIKit
* CSS

