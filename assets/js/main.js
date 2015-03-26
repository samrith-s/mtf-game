(function($){
 
    $.fn.shuffle = function() {
 
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
 
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
 
        return $(shuffled);
 
    };
 
})(jQuery);

var base, buckets, choices, messages, quesbank;

$(function() {
    initLayout();
    initGame();
});

function initLayout() {
    base = new Environment("base");
    buckets = new Environment("buckets");
    messages = new Environment("messages");
    choices = new Environment("choices");
    
    loadConfig(base);
    loadConfig(buckets);
    loadConfig(choices);
    initQuiz();
    
    loadConfig(messages);
}

function initGame() {
    quesbank = Question.all;
    quesbank = shuffle(quesbank);
    playGame(quesbank);
}

function generateStatementBlock() {
    for(i in quesbank)
        $("#bucket1 ul").append("<li class='statementblock" + i + "'><span>" + quesbank[i].name + "</span></li>")
}

function generateAnswerBlock() {
    for(i in quesbank)
        $("#bucket2 ul").append("<li class='answerblock'><span></span></li>");
}

function generateChoicesBlock() {
    for(i in quesbank)
        $("#choices").append("<div class='choicesblock" + i + "'>" + quesbank[i].options[0].name + "</div>");
    
    $("#choices div").shuffle();
}

function playGame(quesbank) {
        generateStatementBlock();
        generateAnswerBlock();
        generateChoicesBlock();
        setDragDrop();
}

function setDragDrop() {
    var i =0;
    $(".answerblock").each(function() {
            $(this).attr("mxkeystrlogslotid", i + "" + (i+1) + "" + (i+2));
            var class_ = ".choicesblock" + $(this).attr("mxkeystrlogslotid")[0];
            $(this).droppable({
                accept: class_,
                drop: function() {
                    $(this).find('span').html($(class_).html());
                    $(class_).animate({visibility: "hidden", opacity: 0}, 400);
                    setTimeout(function() {
                        $(this).find('span').fadeIn(1000);
                        $(class_).animate({visibility: "visible", opacity: 1}, 400);
                    },400);
                    $(class_).addClass("no-click less-opacity strike-through");
                    setTimeout(function() {
                        if($(".no-click").length===quesbank.length)
                            displayMessage("Yay. You won. Try having a social life for a change. :)");
                    },500);
                }
            });
            i++;
         });
    
    for(var i in quesbank) {        
        $(".choicesblock" + i).draggable({
            containment: "#ptotemy-game",
            scroll: "false",
            revert: true,
            opacity: 0.7
        });
    }
}

function displayMessage(str) {
    $("#messages").fadeIn();
    $("#messageBox").empty().append(str);
    $("#messages").css({zIndex: 3});
}           

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}