import{config} from '/apikey.js'

const str = getParam('data');
const url = getParam('URL');

const prefixPrompt = 'サービスを利用する際には多くの場合利用規約に同意することが求められますが、人々は利用規約をよく読まずに同意しています。その行為には、利用規約に書かれた利用者にとって不利な条項にも同意してしまうという潜在的な危険性をはらんでいます。あなたは人々をそのような危険から守る有能なアシスタントです。利用規約から危険性を孕む条項を抜き出し、それが何条何項か、その危険性の要約、その危険性の詳細を私に教えて下さい。もちろんそのような危険のない利用規約もありますので、その場合には何も返さなくていいです。本当に危険だと思うものだけ教えて下さい。';
const prefixPrompt_similar_service = "以下のURLのサービスに類似する他のサービスを調査して、その中の3つのサービス名を箇条書きで生成してください。\nサービス名以外は必要ないです.\n箇条書きの形式は以下のようにしてください\nサービス名 hoge\nサービス名 hoge,";

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
      console.log(data[i].choices[0].message.content);
      const str = JSON.parse(data[i].choices[0].message.content);
      const seq = [];
      for (var ii in str) {
        seq.push(str[ii]);
      }
      console.log(seq);
      for (var iii = 0; iii < seq.length; iii += 2) {
        result.push({
          "danger":seq[iii],
          "reason":seq[iii+1]
        });
      }
    }
    console.log(result);
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
        "model": "gpt-3.5-turbo-1106",
        "messages": [ 
          {
              "role": "system",
              "content": "人々は、利用しようとしたサービスが危険を伴うせいでそのサービスを利用するかよく悩みます。あなたはそのような人々に、彼らが利用しようとしていたサービスに類似する別のサービスを提示することで助ける有能なアシスタントです。受信するサービス名からそれに類似するものを私に教えて下さい。"
          },
          {
            "role": "user",
            "content": "JSON形式で返答してください。" 
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
    $('.cautions').append('<article class="uk-margin-top uk-margin-bottom uk-margin-left uk-margin-right uk-card uk-card-default uk-card-body click"><h4>' + result[i].danger +'<i class="fa-solid fa-plus btn"></i></h4><h5 class="detail">' + result[i].reason + '</h5></article>');
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

 
}

function showSuggestions(recommends) {
  for (let i=0;i<recommends.length;i++) {
    $('.recommends').append('<article class="uk-margin-top uk-margin-bottom uk-margin-left uk-margin-right uk-card uk-card-default uk-card-body recommend"><h2>' + recommends[i] + '</h2></article>');
  }
  $('.recommend').click(function() {
    const i = $('.recommend').index($(this));
    window.open("https://www.google.com/search?q=" + recommends[i]);
});
}