function pickUp()
{
    let target = $('iframe').contents().find('body');
    let tf = target.text().replace(/\s+/g, '').replace(/\r?\n/g, '');
    if (!target.text().match("規約")) {
        tf = "";
    }
    if (!tf) {
        target = $('p:contains("。"), ol:has(li:contains("。"))').parent();
        tf = target.text().replace(/\s+/g, '').replace(/\r?\n/g, '');
    }
    if (!tf) {
        target = $('article, pre');
        tf = target.text().replace(/\s+/g, '').replace(/\r?\n/g, '');
    }
    if (!tf) {
        target = $('div:contains("。")');
        tf = target.text().replace(/\s+/g, '').replace(/\r?\n/g, '');
    }
	target.css('background-color','deepskyblue');
    target.css('color','white');

    let returnText = "";
    target.each(function(index, element) {
        if (returnText.indexOf($(element).text()) === -1) {
            returnText += $(element).text();
        }
    });
    returnText = returnText.replace(/\s+/g, '');

    return returnText;
}

/*「新版」：上の「改良」の方が精度は高いが、「改良」が上手くいかないときに上手くいく。
function pickUp()
{
    let target = $('iframe').contents().find('body');
    let tf = target.text().replace(/\s+/g, '').replace(/\r?\n/g, '');
    if (!target.text().match("規約")) {
        tf = "";
    }
    if (!tf) {
        target = $('body').find('main');
        tf = target.text().replace(/\s+/g, '').replace(/\r?\n/g, '');
    }
    if (!tf) {
        target = $('body').children('div').find('*:has(*:contains(。))');
        tf = target.text().replace(/\s+/g, '').replace(/\r?\n/g, '');
    }
    if (!tf) {
        target = $('article, pre');
        tf = target.text().replace(/\s+/g, '').replace(/\r?\n/g, '');
    }
    if (!tf) {
        target = $('div:contains(。)');
    }
	target.find('*').css('background-color','deepskyblue');
    target.find('*').css('color','white');
	target.css('background-color','deepskyblue');
    target.css('color','white');
    console.log(target.text());
    return target.text();
}
*/