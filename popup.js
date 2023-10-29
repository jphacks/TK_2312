import{config} from '/apikey.js'

console.log("popup is coming");
console.log(getParam('data'));
console.log(config.apikey)

const searchedClue = getParam('data')
const url = getParam('URL')
console.log(url)

const prefixPrompt = '以下の利用規約のユーザにとって不利になりうるという観点から危険なところとその理由を箇条書きで抜き出してください．箇条書きの形式では，危険な箇所と理由はセットにしてください. 以下のように\n\n危険な箇所:hoge hoge hoge\n理由: huga huga huga\n以下つづく'
const prefixPrompt_similar_service = "以下のURLのサービスに類似する他のサービスを調査して、その中の3つのサービス名を箇条書きで生成してください。\nサービス名以外は必要ないです.\n箇条書きの形式は以下のようにしてください\nサービス名 hoge\nサービス名 hoge,"

hideComponents();
askGpt();
askSimilarService();

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function askGpt() {
    console.log('Ask gpt!')
    fetch("https://api.openai.com/v1/chat/completions",{
        
    })
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
              "content": prefixPrompt + searchedClue 
            }
          ],
          "temperature": 0.1,
          "max_tokens": 1000
        })
      })
      .then(response=>{
        return response.json()
      }).then(data =>{
        const str = data.choices[0].message.content
        console.log(str)
        const sections = str.split('\n\n');
        const result = [];
        sections.forEach(section => {
        const lines = section.split('\n');
        if (lines.length >= 2) {
          const danger = lines[0].replace('危険な箇所: ', '');
          const reason = lines[1].replace('理由: ', '');
          result.push({ danger, reason });
         } 
        });
        console.log(result);
        showComponents(result)
      }).catch(error => {
        console.log(error)
      })
}

async function askSimilarService() {
  console.log('Ask gpt!')
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
      console.log(data)
      const input = data.choices[0].message.content
      const serviceNames = input.match(/サービス名: (\w+)/g).map(match => match.split(": ")[1])
      console.log(serviceNames)
      showSuggestions(serviceNames)
    }).catch(error => {
      console.log(error)
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
        // slideUpメソッドを用いて、$answerを隠してください
        $detail.slideUp();
  
        // 子要素のspanタグの中身をtextメソッドを用いて書き換えてください
        $(this).find(".btn").removeClass('fa-minus');
        $(this).find(".btn").addClass('fa-plus');
        
    } else {
        $detail.addClass('open'); 
        // slideDownメソッドを用いて、$answerを表示してください
        $detail.slideDown();
  
        
        // 子要素のspanタグの中身をtextメソッドを用いて書き換えてください
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
    var i = $('.recommend').index($(this));
    window.open("https://www.google.com/search?q=" + recommends[i]);
});
}