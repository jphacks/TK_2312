let cautions = [
    {
        problem:"あなたのメールアドレスを自由に使います。",
        reason:"プライバシーの侵害"
    },
    {
        problem:"あなたの住所を特定します。",
        reason:"プライバシーの侵害"
    }
]

$(function(){
    $('header').hide();
    $('main').hide();
    $('footer').hide();
    $('.progress-modal-wrapper').delay(1000).fadeOut();
    $('header').delay(1000).fadeIn();
    $('main').delay(1000).fadeIn();
    $('footer').delay(1000).fadeIn();

    for (let i=0;i<cautions.length;i++) {
        $('.cautions').append('<article class="uk-margin-top uk-margin-bottom uk-margin-left uk-margin-right uk-card uk-card-default uk-card-body"><h2>' + cautions[i].problem +'<i class="fa-solid fa-plus btn"></i></h2><p class="detail">' + cautions[i].reason + '</p></article>');
    }

    $('article').click(function() {
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

});