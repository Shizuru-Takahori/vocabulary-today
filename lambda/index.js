const Alexa = require('ask-sdk-core');

const startConv = '<amazon:domain name="conversational">';
const endConv = '</amazon:domain>';
const startSalli = '<lang xml:lang="en-US"><voice name="Salli">';
const endSalli = '</voice></lang>';
const startSlow = '<prosody rate="x-slow">';
const endSlow = '</prosody>';

const wordsData = require('./words.json');
const wordsLength = Object.keys(wordsData['words']).length; 
    
//単語をランダムで選択し読み込む
var wordNum = Math.floor(Math.random() * wordsLength);
var ww = wordsData.words[wordNum]
var word = ww.word;
var part = ww.part;
var ex = ww.ex;
var wordMean = ww.wordMean;
var exMean = ww.exMean;
    
//例文が無い時の処理
if(ex === 'none'){
    let ex = '例文はありません';
    let exMean = '';
}


//launch intent
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
         const speakOutput = startConv + '今日の英単語｡' + endConv + startSalli + word + '<break time="1s" />' + startSlow + word + endSlow + endSalli + startConv + '<break time="3s" />｢意味を教えて｣と言うと､日本語やくと例文を言います｡' +endConv ;
         return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



//テキスト作成
const FormattingHandler = function(){
    
        //スペル作成
        var spelling = "";
        word.split("").forEach(function(v) {
                spelling += "  " + v + "  ";
            });
            
        spelling = startSlow + startSalli + spelling + endSalli + endSlow;
        
        const wordText = startSalli + word + endSalli + '<break time="1s" />:' + startConv + wordMean + endConv + '<break time="1s" />';
        const exText = startSalli + ex + endSalli + '<break time="1s" />:' + startConv + exMean + endConv + '<break time="1s" />';
        
        const text = wordText + startSlow + wordText + endSlow + startConv + 'スペル<break time="1s" />' + spelling + '<break time="1s" />例文' + endConv + '<break time="30ms" />' + exText + exText;
        const messageText = text + startConv + '<break time="50ms" />もう1度言ってほしいときは､もう1度言って､と話しかけてください｡ <break time="2s" />' + endConv;

        
    return messageText
    }


//訳と例文を言う
const CommentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Comment';
    },
    handle(handlerInput) {
        const speakOutput = startConv + '日本語やくと例文です｡<break time="50ms" />' + endConv + FormattingHandler();

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



//もういちど言う
const OneMoreIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OneMore';
    },
    handle(handlerInput) {
        const speakOutput = startConv + 'もう1度､言います｡<break time="1s" />' + endConv + FormattingHandler();

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = '｢アレクサ､今日の英単語｣と言うと起動します｡もう一度言って欲しいときは｢もう一度言って｣と話しかけてください｡終了する場合は｢停止｣と言ってください｡もう1ど言って欲しいときは｢ヘルプ｣と言ってください｡';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = "今日の英単語を終了します";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'すみません｡うまくいきませんでした｡もう1度話しかけてください｡または｢ヘルプ｣で発話例を尋ねてください｡';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'すみません｡うまくいきませんでした｡もう1度話しかけてください';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
    exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CommentIntentHandler,
        OneMoreIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('todaysEnglish')
    .lambda();