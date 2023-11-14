import{config} from '/apikey.js'

const str = getParam('data');
const url = getParam('URL');

const prefixPrompt = '以下の利用規約のユーザにとって不利になりうるという観点から危険なところとその理由を箇条書きで抜き出してください．箇条書きの形式では，危険な箇所と理由はセットにしてください. 以下のように\n\n危険な箇所:hoge hoge hoge\n理由: huga huga huga\n以下つづく';
const prefixPrompt_similar_service = "以下のURLのサービスに類似する他のサービスを調査して、その中の3つのサービス名を箇条書きで生成してください。\nサービス名以外は必要ないです.\n箇条書きの形式は以下のようにしてください\nサービス名 hoge\nサービス名 hoge,";

hideComponents();

const example = [
  {
    "danger":"危ないよ～",
    "place":"1条1項",
    "reason":"危ないね～"
  },
  {
    "danger":"危ないよ～",
    "place":"1条1項",
    "reason":"危ないね～"
  },
  {
    "danger":"危ないよ～",
    "place":"1条1項",
    "reason":"危ないね～"
  },
  {
    "danger":"危ないよ～",
    "place":"1条1項",
    "reason":"危ないね～"
  },
];

const length = 1500;
const arrays = splitJapaneseText(str, length);
const promises = [];
for(const item of arrays){
  promises.push(askGpt(item))
}
Promise.all(promises)
  .then(datum => {
    console.log(datum)
    hideComponents();
    return datum;
  })
  .then(data =>{
    const result = [];
    for (let i = 0;i<arrays.length;i++) {
      console.log(data[i])
      const str = data[i].choices[0].message.content;
      const sections = str.split('\n\n');
      sections.forEach(section => {
      const lines = section.split('\n');
      if (lines.length >= 2) {
        const danger = lines[0].replace('危険な箇所: ', '');
        const reason = lines[1].replace('理由: ', '');
        result.push({ danger, reason });
       } 
      });
    }
    showComponents(example);
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
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function askGpt(searchedClue) {
  console.log("askGpt")
    return fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": config.apikey
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [ 
            {
              "role": "user",
              "content": prefixPrompt + searchedClue 
            }
          ],
          "temperature": 0.1,
          "max_tokens": 700
        })
      })
      .then(response=>{
        if(response.ok){
          console.log("response is ok")
          return response.json()
        } else {
          console.log(response)
        }
      }).catch(error => {
        console.log(error);
      })
}

async function askSimilarService() {
  fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": config.apikey
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [ 
          {
            "role": "user",
            "content":  prefixPrompt_similar_service + url 
          }
        ],
        "temperature": 0.1,
        "max_tokens": 1000
      })
    })
    .then(response=>{
      return response.json()
    }).then(data =>{
      const input = data.choices[0].message.content
      const serviceNames = input.match(/サービス名: (\w+)/g).map(match => match.split(": ")[1])
      console.log(serviceNames)
      showSuggestions(serviceNames)
    }).catch(error => {
      console.log(error);
    })
}

function hideComponents() {
  $('header').hide();
  $('main').hide();
  $('footer').hide();
}

function showComponents(result) {

  for (let i=0;i<result.length;i++) {
    $('.cautions').append('<div class="click"><h4>' + result[i].danger +'<i class="fa-solid fa-plus btn"></i></h4><h5 class="detail gray">' + result[i].place + '</h5><h5 class="detail">' + result[i].reason + '</h5></div>');
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

function showSuggestions(recommends) {
  for (let i=0;i<recommends.length;i++) {
    $('.recommends').append('<div class="recommend"><h2>' + recommends[i] + '</h2></div>');
  }
  $('.recommend').click(function() {
    const i = $('.recommend').index($(this));
    window.open("https://www.google.com/search?q=" + recommends[i]);
});
}