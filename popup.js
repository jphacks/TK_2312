import{config} from '/apikey.js'

console.log("popup is coming");
console.log(getParam('data'));
console.log(config.apikey)

const searchedClue = getParam('data')

const prefixPrompt = '以下の利用規約のプライバシーの面から危険なところとその理由を箇条書きで抜き出してください．箇条書きの形式では，危険な箇所と理由はセットにしてください．以下のように\n\n危険な箇所:hoge hoge hoge\n理由: huga huga huga\n以下つづく'

askGpt();

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
          "Authorization": `${config.apikey}`
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [ 
            {
              "role": "user",
              "content": prefixPrompt + searchedClue 
            }
          ],
          "temperature": 0.3,
          "max_tokens": 2000
        })
      })
      .then(response=>{
        console.log(response.json())
        if (response.ok) {
            const str = response['choices'][0]['message']['content']
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
        }
      }).then(data =>{
        console.log(data)
      }).catch(error => {
        console.log(error)
      })
}