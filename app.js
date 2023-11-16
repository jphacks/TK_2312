import{config} from '/apikey.js'

const numberOfData = getParam('i');
let str = "";
for (let i = 0; i < numberOfData; i++) {
  const data = "data" + i;
  str += getParam(data); 
}
const url = getParam('URL');

const prefixPrompt = 'サービスを利用する際には多くの場合利用規約に同意することが求められますが、人々は利用規約をよく読まずに同意しています。\
その行為には、利用規約に書かれた利用者にとって不利な条項にも同意してしまうという潜在的な危険性をはらんでいます。あなたは人々をそのような危険から守る有能なアシスタントです。\
出力例は以下のルールのようにしてください. また,hoge,huga,piyo,puniは例なので実際には出力しないでください.\
# ルール \
- dangerには危険な理由を要約したものが入ります。reasonに説明を入れるので、dangerに入れる内容は簡潔にしてください \
- placeには抜き出してきた文章が何条の何項、もしくは何番なのかが入ります \
- reasonにはその利用規約が危険である理由の文章が入ります.リッチに出力してください. \
- 全て日本語のJSONファイルで出力してください \
- 危険な箇所がいくつかある場合は危険性の高いものから順に2つまで教えて下さい。 \
- 本当に人々が知る必要のある箇所だけ教えて下さい。 \
- 入力には利用規約とは関係のない内容が含まれることがありますが、その部分は分析しないでください。 \
#出力例は以下のようになります \
{"dangerousClauses": [{"danger": "hoge", "place": "第1条第1項", "reason": "huga"}, {"danger": "piyo", "place": "第2条", "reason": "puni"}]}; \
#危険な箇所が無かった場合の出力例は以下のようになります \
{"dangerousClauses": []}';
const prefixPrompt_similar_service = '次のURLのサービスに類似する他のサービスを調査して、その中の3つのサービス名をJSONで生成してください。\
出力例は以下のようになります\
{"similarServices": [{"title": "hoge"}, {"title": "huga"}]};';

hideComponents();

const length = 1500;
const arrays = splitJapaneseText(str, length);
const promises = [];

for(const item of arrays){
  promises.push(askGpt(item));
}

Promise.all(promises)
.then(datum => {
    console.log(datum);
    hideComponents();
    return datum;
})
.then(data =>{
  const result = [];
  for (let i = 0;i<arrays.length;i++) {
    if (data[i]) {
      console.log(data[i].choices[0].message.content);
      const str = JSON.parse(data[i].choices[0].message.content).dangerousClauses;
      for (let j = 0; j < str.length; j++) {
        result.push(str[j]);
      }
    }
  }
  showComponents(result)
})

askSimilarService();

function splitJapaneseText(text, maxLength) {
  if (typeof text !== 'string' || text.length <= maxLength) {
    return [text]; // 文字列が指定の長さ以下の場合、そのまま返す
  }

  const sentences = text.split('。'); // 文章ごとに分割
  let currentChunk = ''; // 現在のチャンク
  const chunks = [];

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxLength) {
      currentChunk += sentence + '。';
    } else {
      chunks.push(currentChunk);
      currentChunk = sentence + '。';
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    console.log(name + "isOK");
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function askGpt(searchedClue) {
  console.log("askGpt");
    return fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": config.apikey
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo-1106",
          "messages": [ 
            {
              "role": "system",
              "content": prefixPrompt
            },
            {
              "role": "user",
              "content": "JSON形式で返答してください。以下が利用規約です。" 
            },
            {
              "role": "user",
              "content": searchedClue 
            }
          ],
          "temperature": 0.1,
          "max_tokens": 700,
          "response_format": {"type": "json_object"}
        })
      })
      .then(response=>{
        if(response.ok){
          console.log("response is ok");
          return response.json();
        } else {
          console.log(response);
        }
      }).catch(error => {
        console.log(error);
      })
}

async function askSimilarService() {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": config.apikey
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo-1106",
        "messages": [ 
          {
            "role": "system",
            "content": "人々は、利用しようとしたサービスが危険を伴うせいでそのサービスを利用するかよく悩みます。あなたはそのような人々に、彼らが利用しようとしていたサービスに類似する別のサービスを提示することで助ける有能なアシスタントです。"
          },
          {
            "role": "user",
            "content": "JSON形式の配列で返答してください。" 
          },
          {
            "role": "user",
            "content":  prefixPrompt_similar_service + url 
          }
        ],
        "temperature": 0.1,
        "max_tokens": 1000,
        "response_format": {"type": "json_object"}
      })
    });
    if(response.ok){
      const data = await response.json();
      console.log("response is ok");
      console.log(data);
      await showSuggestions(data);
    } else {
      console.log("response is not ok");
    }
  } catch (error) {
    console.error(error);
  }
}

function hideComponents() {
  $('header').hide();
  $('main').hide();
  $('footer').hide();
}

function showComponents(result) {

  for (let i=0;i<result.length;i++) {
    $('.cautions').append('<div class="click"><h4>' + result[i].danger +'</h4><div class="i"><i class="fa-solid fa-plus"></i></div><div class="clear"></div><h5 class="detail gray">' + result[i].place + '</h5><h5 class="detail">' + result[i].reason + '</h5></div>');
  }

  if (result.length == 0) {
    $('.cautions').append('<h3>検出されませんでした。</h3>');
  }

  $('.progress-modal-wrapper').fadeOut();
  $('header').fadeIn();
  $('main').fadeIn();
  $('footer').fadeIn();

  $('.click').click(function() {
    var $detail = $(this).find('.detail');
    if($detail.hasClass('open')) { 
        $detail.removeClass('open');
        $detail.slideUp();  
        $(this).find(".btn").removeClass('fa-minus');
        $(this).find(".btn").addClass('fa-plus');
        
    } else {
        $detail.addClass('open'); 
        $detail.slideDown();        
        $(this).find(".btn").removeClass('fa-plus');
        $(this).find(".btn").addClass('fa-minus');

    }
  });

  $('.jatoen').click(function() {
    $('.ja').hide();
    $('.en').show();
  });
  $('.entoja').click(function() {
    $('.en').hide();
    $('.ja').show();
  });
 
}

function showSuggestions(recommendsJSON) {
  const recommends = JSON.parse(recommendsJSON.choices[0].message.content);

  for (var i in recommends.similarServices) {
    $('.recommends').append('<div class="recommend"><h2>' + recommends.similarServices[i].title + '</h2></div>');
  }

  $('.recommend').click(function() {
    const ind = $('.recommend').index($(this));
    window.open("https://www.google.com/search?q=" + recommends.similarServices[ind].title);
  });
}
