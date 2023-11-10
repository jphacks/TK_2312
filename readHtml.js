function pickUp()
{
    let target = $('p:contains("規約"),p:contains("サービス"),p:contains("利用"),p:contains("terms"),p:contains("service")').parent();
	target.css('background-color','deepskyblue');
    target.css('color','white');
    return target.text();
}
