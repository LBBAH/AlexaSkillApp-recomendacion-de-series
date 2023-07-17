/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
var persistenceAdapter = getPersistenceAdapter();
const languageStrings = require('./localisation');

const DOCUMENT_WELCOME = "bienvenidaAPL";
const DOCUMENT_CANCEL = "cancel-stopAPL";
const DOCUMENT_HELP = "helpAPL";
const DOCUMENT_SERIE = "aplDeSeriesxd";
const DOCUMENT_opciones = "opcionesRecomendaciones";


const datasource_SERIE = {
    "headlineTemplateData": {
        "type": "object",
        "objectId": "headlineSample",
        "launchData": {
            "headerTitle": "Nombre serie",
            "hintString": "Alexa, register my birthday",
            "logoImage": "https://i.imgur.com/ZJJtcRT.png",
            "backgroundImage": "https://i.pinimg.com/736x/d7/2f/5a/d72f5ac948b643c2cbc1bfad520d9f2f.jpg",
            "backgroundOpacity": "0.5",
            "text": "Película de 2017 producida por New Line Cinema, KatzSmith Productions, Lin Pictures y Vertigo Entertainment, y distribuida por Warner Bros Pictures. Es la segunda adaptación de la novela homónima de Stephen King y está destinada a ser la primera entrega de una duología planificada",
            "descripcion": "para volver al inicio Di,  \"recomiendame una pelicula\""
        }
    }
};


const createDirectivePayloadDS = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};
const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        }
    }
};


let info =  datasource_SERIE;

let serie_elejida = "";

const series = [
    {
        nombre: "stranger things",
        descripcion:"Stranger Things es una serie de televisión web estadounidense de suspenso y ciencia ficción coproducida y distribuida por Netflix.​",
        categoría: "drama",
        añosDeEstreno: 2016,
        actorPrincipal: "millie bobby brown",
        región: "américa",
        plataforma: "netflix",
        url:"https://cdn.alza.cz/Foto/ImgGalery/Image/stranger-things-4-poster.jpg"
    },
    {
        nombre: "game of thrones",
        descripcion:"Game of Thrones es una serie de televisión de drama y fantasía medieval desarrollada por David Benioff y D. B. Weiss y producida por la cadena HBO. ",
        categoría: "fantasía",
        añosDeEstreno: 2011,
        actorPrincipal: "kit harington",
        región: "europa",
        plataforma: "HBO",
        url:"https://i.redd.it/h7uga1bv24fz.jpg"
    },
    {
        nombre: "the crown",
        descripcion:"The Crown es una serie de televisión británica y estadounidense, creada y escrita por Peter Morgan y producido por Left Bank Pictures para Netflix.",
        categoría: "histórica",
        añosDeEstreno: 2016,
        actorPrincipal: "olivia dolman",
        región: "europa",
        plataforma: "netflix",
        url:"http://br.web.img3.acsta.net/pictures/19/10/22/14/31/2797425.jpg"
    },
    {
        nombre: "breaking bad",
        descripcion:"Breaking Bad es una serie de televisión dramática estadounidense creada y producida por Vince Gilligan. Breaking Bad narra la historia de Walter White, un profesor de química con problemas económicos a quien le diagnostican un cáncer de pulmón inoperable.",
        categoría: "drama",
        añosDeEstreno: 2008,
        actorPrincipal: "bryan cranston",
        región: "américa",
        plataforma: "AMC",
        url:"http://fr.web.img5.acsta.net/pictures/19/06/18/12/11/3956503.jpg"
    }
];

const series_ingl = [
    {
        nombre: "stranger things",
        descripcion: "Stranger Things is an American web television series of suspense and science fiction co-produced and distributed by Netflix.",
        categoría: "drama",
        añosDeEstreno: 2016,
        actorPrincipal: "millie bobby brown",
        región: "america",
        plataforma: "netflix",
        url: "https://cdn.alza.cz/Foto/ImgGalery/Image/stranger-things-4-poster.jpg"
    },
    {
        nombre: "game of thrones",
        descripcion: "Game of Thrones is a television series of drama and medieval fantasy developed by David Benioff and D. B. Weiss and produced by HBO.",
        categoría: "fancy",
        añosDeEstreno: 2011,
        actorPrincipal: "kit harington",
        región: "europe",
        plataforma: "HBO",
        url: "https://i.redd.it/h7uga1bv24fz.jpg"
    },
    {
        nombre: "the crown",
        descripcion: "The Crown is a British and American television series created and written by Peter Morgan and produced by Left Bank Pictures for Netflix.",
        categoría: "historical",
        añosDeEstreno: 2016,
        actorPrincipal: "olivia dolman",
        región: "europe",
        plataforma: "netflix",
        url: "http://br.web.img3.acsta.net/pictures/19/10/22/14/31/2797425.jpg"
    },
    {
        nombre: "breaking bad",
        descripcion: "Breaking Bad is an American drama television series created and produced by Vince Gilligan. Breaking Bad tells the story of Walter White, a chemistry teacher with financial problems who is diagnosed with inoperable lung cancer.",
        categoría: "drama",
        añosDeEstreno: 2008,
        actorPrincipal: "bryan cranston",
        región: "america",
        plataforma: "AMC",
        url: "http://fr.web.img5.acsta.net/pictures/19/06/18/12/11/3956503.jpg"
    }
];


function filtrarPorNombre_ingl(name) {
    return  series_ingl.filter(serie => serie.nombre == name);
}

function filtrarPorActorPrincipal_ingl(actor) {
    return  series_ingl.filter(serie => serie.actorPrincipal == actor);
}

function filtrarPorCategoria_ingl(categoria) {
    return series_ingl.filter(serie => serie.categoría == categoria);
}

function filtrarPorAnioEstreno_ingl(anio) {
    return series_ingl.filter(serie => serie.añosDeEstreno == anio);
}

function filtrarPorRegion_ingl(region) {
    return series_ingl.filter(serie => serie.región == region);
}

function filtrarPorPlataforma_ingl(plataforma) {
    return series_ingl.filter(serie => serie.plataforma == plataforma);
}





function filtrarPorNombre(name) {
    return  series.filter(serie => serie.nombre == name);
}

function filtrarPorActorPrincipal(actor) {
    return  series.filter(serie => serie.actorPrincipal == actor);
}

function filtrarPorCategoria(categoria) {
    return series.filter(serie => serie.categoría == categoria);
}

function filtrarPorAnioEstreno(anio) {
    return series.filter(serie => serie.añosDeEstreno == anio);
}

function filtrarPorRegion(region) {
    return series.filter(serie => serie.región == region);
}

function filtrarPorPlataforma(plataforma) {
    return series.filter(serie => serie.plataforma == plataforma);
}
function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'serie_table';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();

        const categorie_name = sessionAttributes['categorie_name'];
        let speakOutput
        
        
        
        if(categorie_name){
            speakOutput = requestAttributes.t('LAUNCH_REQUEST_SERIE_GUADADA') + categorie_name
        }
        
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayloadDS(DOCUMENT_WELCOME, 
                {               
                    "dataWelcome": {
                        "text": requestAttributes.t('welcome_one'),
                        "help": requestAttributes.t('welcome_help')
                    }
                }
            );
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        
        speakOutput = requestAttributes.t('WELCOME_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const eleccionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'eleccionDeOpcionesIntent';
    },
    handle(handlerInput) {

        const {intent} = handlerInput.requestEnvelope.request;
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const requestAttributes = attributesManager.getRequestAttributes();
        
        const eleccion_id = intent.slots.eleccion.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM
        const eleccion = intent.slots.eleccion.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let speechText="";
        
        
        if(eleccion_id == 1){
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_opciones,
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": requestAttributes.t('headerTitleONE'),
                            "logoImage": "https://educacionespecialmx.site/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview.png",
                            "backgroundImage": "https://s.yimg.com/uu/api/res/1.2/DZgKgCn9csMDDyQJHcpUeA--~B/aD0xMDgwO3c9MTkyMDtzbT0xO2FwcGlkPXl0YWNoeW9u/https://media.zenfs.com/en/stylecaster_935/98791b8c31138ff317147012cf7986ae",
                            "backgroundOpacity": "0.5",
                            "text": requestAttributes.t('text_ONE_eleccion'),
                            "descripcion": requestAttributes.t('descripcion_eleccion')
                        }
                    }
                }
                
                
                );
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            speechText = requestAttributes.t('text_ONE_eleccion')
        }else if(eleccion_id == 2){
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_opciones,
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": requestAttributes.t('headerTitleTWO'),
                            "logoImage": "https://educacionespecialmx.site/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview.png",
                            "backgroundImage": "https://3.bp.blogspot.com/-IjiwHI_6oeU/VtdFv1uVJRI/AAAAAAAAA1s/eG9VOu_uszI/s1600/series.jpg",
                            "backgroundOpacity": "0.5",
                            "text": requestAttributes.t('text_TWO_eleccion'),
                            "descripcion": requestAttributes.t('descripcion_eleccion')
                        }
                    }
                }
                
                
                );
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            speechText = requestAttributes.t('text_TWO_eleccion')
        }else if(eleccion_id == 3){
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_opciones,
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": requestAttributes.t('headerTitleTRHEE'),
                            "logoImage": "https://educacionespecialmx.site/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview.png",
                            "backgroundImage": "http://www.portaldailha.com.br/noticias/fotos/familia-dinossauro.jpg",
                            "backgroundOpacity": "0.5",
                            "text": requestAttributes.t('text_TRHEE_eleccion'),
                            "descripcion": requestAttributes.t('descripcion_eleccion')
                        }
                    }
                }
                
                
                );
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            speechText = requestAttributes.t('text_TRHEE_eleccion')
        }else if(eleccion_id == 4){
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_opciones,
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": requestAttributes.t('headerTitleFOR'),
                            "logoImage": "https://educacionespecialmx.site/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview.png",
                            "backgroundImage": "https://www.ecartelera.com/images/sets/48000/48021.jpg",
                            "backgroundOpacity": "0.5",
                            "text": requestAttributes.t('text_FOR_eleccion'),
                            "descripcion": requestAttributes.t('descripcion_eleccion')
                        }
                    }
                }
                
                
                );
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            speechText = requestAttributes.t('text_FOR_eleccion')
        }else if(eleccion_id == 5){
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_opciones,
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": requestAttributes.t('headerTitleFIVE'),
                            "logoImage": "https://educacionespecialmx.site/Dise%C3%B1o_sin_t%C3%ADtulo-removebg-preview.png",
                            "backgroundImage": "https://zayzay.com/wp-content/uploads/2020/04/01_HBO_LOGO.jpg",
                            "backgroundOpacity": "0.5",
                            "text": requestAttributes.t('text_FIVE_eleccion'),
                            "descripcion": requestAttributes.t('descripcion_eleccion')
                        }
                    }
                }
                
                
                );
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            speechText = requestAttributes.t('text_FIVE_eleccion')
        }else{
            speechText = requestAttributes.t('eleccion_error')
        }
        

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};



const recomendActorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'recomendActorIntent';
    },
    handle(handlerInput) {

        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        
        let actor = handlerInput.requestEnvelope.request.intent.slots.actor.value;
        let seriesPorActor
        
        if (handlerInput.requestEnvelope.request.locale === 'en-US') {
          seriesPorActor = filtrarPorActorPrincipal_ingl(actor.toLowerCase());
        } else {
          seriesPorActor = filtrarPorActorPrincipal(actor.toLowerCase());
        }
        
    
        
        
        let speakOutput;
        
        if (seriesPorActor.length != 0) {
          let nombresSeriesPorActor
        
            if (seriesPorActor.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * seriesPorActor.length);
                nombresSeriesPorActor = seriesPorActor[indiceAleatorio];
            }
            
            
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_SERIE, 
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": nombresSeriesPorActor.nombre,
                            "hintString": "Alexa, register my birthday",
                            "logoImage": "https://i.imgur.com/ZJJtcRT.png",
                            "backgroundImage": nombresSeriesPorActor.url,
                            "backgroundOpacity": "0.5",
                            "text": nombresSeriesPorActor.descripcion,
                            "descripcion": requestAttributes.t('Guardar_serie')
                        }
                    }
                }); 
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            
            serie_elejida = nombresSeriesPorActor.nombre
         
            speakOutput = requestAttributes.t('recomendar')+ nombresSeriesPorActor.nombre;
        } else {
          speakOutput = requestAttributes.t('recomendar_por_actor_error')
        }

        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const recomendCategoriaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'recomendCategoriaIntent';
    },
    handle(handlerInput) {

        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        let categoria = handlerInput.requestEnvelope.request.intent.slots.categoria.value;
        
        
        let seriesPorCategoria;
        const locale = handlerInput.requestEnvelope.request.locale;
        
        if (locale === 'en-US') {
          seriesPorCategoria = filtrarPorCategoria_ingl(categoria.toLowerCase());
        } else {
          seriesPorCategoria = filtrarPorCategoria(categoria.toLowerCase());
        }
        
        
        
        
        
        let speakOutput;
        
        if (seriesPorCategoria.length != 0) {
          let nombresSeriesPorCategoria
            
            if (seriesPorCategoria.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * seriesPorCategoria.length);
                nombresSeriesPorCategoria = seriesPorCategoria[indiceAleatorio];
            }
            
            //let nombresSeriesPorCategoria = seriesPorCategoria.map(serie => serie.nombre);
    
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_SERIE, 
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": nombresSeriesPorCategoria.nombre,
                            "hintString": "Alexa, register my birthday",
                            "logoImage": "https://i.imgur.com/ZJJtcRT.png",
                            "backgroundImage": nombresSeriesPorCategoria.url,
                            "backgroundOpacity": "0.5",
                            "text": nombresSeriesPorCategoria.descripcion,
                            "descripcion": requestAttributes.t('Guardar_serie')
                        }
                    }
                }); 
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            
            serie_elejida = nombresSeriesPorCategoria.nombre;
            speakOutput =requestAttributes.t('recomendar')+ nombresSeriesPorCategoria.nombre;
        } else {
          speakOutput = requestAttributes.t('recomendar_por_categoria_error')
        }
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const recomendAnioEstrenoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'recomendAnioEstrenoIntent';
    },
    handle(handlerInput) {

        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        let anio = handlerInput.requestEnvelope.request.intent.slots.anio.value;
        
        
        
        
        let seriesPorAnio;
        const locale = handlerInput.requestEnvelope.request.locale;
        
        if (locale === 'en-US') {
          seriesPorAnio = filtrarPorAnioEstreno_ingl(anio);
        } else {
          seriesPorAnio = filtrarPorAnioEstreno(anio);
        }
        
        
        
        
        
        let speakOutput;
        
        if (seriesPorAnio.length != 0) {
          let nombresSeriesPorAnio

            if (seriesPorAnio.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * seriesPorAnio.length);
                nombresSeriesPorAnio = seriesPorAnio[indiceAleatorio];
            }
            
            
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_SERIE, 
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": nombresSeriesPorAnio.nombre,
                            "hintString": "Alexa, register my birthday",
                            "logoImage": "https://i.imgur.com/ZJJtcRT.png",
                            "backgroundImage": nombresSeriesPorAnio.url,
                            "backgroundOpacity": "0.5",
                            "text": nombresSeriesPorAnio.descripcion,
                            "descripcion": requestAttributes.t('Guardar_serie')
                        }
                    }
                }); 
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            
            serie_elejida=nombresSeriesPorAnio.nombre;
        
            speakOutput = requestAttributes.t('recomendar')+ nombresSeriesPorAnio.nombre;
        } else {
           speakOutput = requestAttributes.t('recomendar_por_anio_error')
        }
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const recomendRegionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'recomendRegionIntent';
    },
    handle(handlerInput) {

        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        let region = handlerInput.requestEnvelope.request.intent.slots.region.value;
        
        
        
        let seriesPorRegion
        const locale = handlerInput.requestEnvelope.request.locale;
        
        if (locale === 'en-US') {
          seriesPorRegion = filtrarPorRegion_ingl(region.toLowerCase());
        } else {
          seriesPorRegion = filtrarPorRegion(region.toLowerCase());
        }
        
        
        
        
        let speakOutput;
        
        if (seriesPorRegion.length != 0) {
          let nombresSeriesPorRegion

            if (seriesPorRegion.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * seriesPorRegion.length);
                nombresSeriesPorRegion = seriesPorRegion[indiceAleatorio];
            }
    
    
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_SERIE, 
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": nombresSeriesPorRegion.nombre,
                            "hintString": "Alexa, register my birthday",
                            "logoImage": "https://i.imgur.com/ZJJtcRT.png",
                            "backgroundImage": nombresSeriesPorRegion.url,
                            "backgroundOpacity": "0.5",
                            "text": nombresSeriesPorRegion.descripcion,
                            "descripcion": requestAttributes.t('Guardar_serie')
                        }
                    }
                }); 
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            
            serie_elejida=nombresSeriesPorRegion.nombre;
            speakOutput = requestAttributes.t('recomendar')+ nombresSeriesPorRegion.nombre;
        } else {
          speakOutput = requestAttributes.t('recomendar_por_Region_error')
        }
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const recomendPlataformaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'recomendPlataformaIntent';
    },
    handle(handlerInput) {

        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        let plataforma = handlerInput.requestEnvelope.request.intent.slots.plataforma.value;
        
        
        
        let seriesPorplataforma;
        const locale = handlerInput.requestEnvelope.request.locale;
        
        if (locale === 'en-US') {
          seriesPorplataforma = filtrarPorPlataforma(plataforma.toLowerCase());
        } else {
          seriesPorplataforma = filtrarPorPlataforma(plataforma.toLowerCase());
        }
        
        
        
        let speakOutput;
        
        if (seriesPorplataforma.length != 0) {
          let nombresSeriesPorplataforma

            if (seriesPorplataforma.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * seriesPorplataforma.length);
                nombresSeriesPorplataforma = seriesPorplataforma[indiceAleatorio];
            }
            
            
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayloadDS(DOCUMENT_SERIE, 
                {
                    "headlineTemplateData": {
                        "type": "object",
                        "objectId": "headlineSample",
                        "launchData": {
                            "headerTitle": nombresSeriesPorplataforma.nombre,
                            "hintString": "Alexa, register my birthday",
                            "logoImage": "https://i.imgur.com/ZJJtcRT.png",
                            "backgroundImage": nombresSeriesPorplataforma.url,
                            "backgroundOpacity": "0.5",
                            "text": nombresSeriesPorplataforma.descripcion,
                            "descripcion": requestAttributes.t('Guardar_serie')
                        }
                    }
                }); 
                handlerInput.responseBuilder.addDirective(aplDirective);
            }
            
            serie_elejida=nombresSeriesPorplataforma.nombre;
    
            speakOutput = requestAttributes.t('recomendar')+ nombresSeriesPorplataforma.nombre;
        } else {
          speakOutput = requestAttributes.t('recomendar_por_plataforma_error')
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};



const GuardarSerieIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GuardarSerieIntent';
    },
    handle(handlerInput) {

        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        sessionAttributes['categorie_name'] = serie_elejida;
        
        const speakOutput = requestAttributes.t('confirmar_guardado_p1')+ sessionAttributes['categorie_name']+requestAttributes.t('confirmar_guardado_p2');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};



const SerieGuardadeIntenttHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SerieGuardadeIntent';
    },
    handle(handlerInput) {

        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        const serie_guardada = sessionAttributes['categorie_name'];
        
        let seriesPorNombre = filtrarPorNombre(serie_guardada.toString());
        let nombreDeSerier = seriesPorNombre[0];
        
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayloadDS(DOCUMENT_SERIE, 
            {
                "headlineTemplateData": {
                    "type": "object",
                    "objectId": "headlineSample",
                    "launchData": {
                        "headerTitle": nombreDeSerier.nombre,
                        "hintString": "Alexa, register my birthday",
                        "logoImage": "https://i.imgur.com/ZJJtcRT.png",
                        "backgroundImage": nombreDeSerier.url,
                        "backgroundOpacity": "0.5",
                        "text": nombreDeSerier.descripcion,
                        "descripcion": requestAttributes.t('descripcion_series_guardadas')
                    }
                }
            }); 
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        const speakOutput = requestAttributes.t('descripcion_series_guardadasP1')+ sessionAttributes['categorie_name']+ requestAttributes.t('descripcion_series_guardadasP2')

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};



const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
    
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayloadDS(DOCUMENT_HELP, 
                {
                    "dataHelp": {
                        "title": requestAttributes.t('help_title'),
                        "subtitle": requestAttributes.t('help_subtitle'),
                        "optionOne": requestAttributes.t('help_OpOne'),
                        "optionTwo": requestAttributes.t('help_OpTwo'),
                        "optionthree": requestAttributes.t('help_OpThree'),
                        "optionFor": requestAttributes.t('help_OpFor'),
                        "optionfive": requestAttributes.t('help_OpFive')
                    }
                }
            );
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
    
        
        const speakOutput = requestAttributes.t('ayuda')

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
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayloadDS(DOCUMENT_CANCEL, 
            {
                "data_stop": {
                    "text_one": requestAttributes.t('cancel_stop_one'),
                    "text_two": requestAttributes.t('cancel_stop_two')
                }
            }
            )
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
      
        
        const speakOutput = requestAttributes.t('cacelar_parar')

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
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        
        const speakOutput = requestAttributes.t('fallback')

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
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = requestAttributes.t('REFLECTOR_MSG', intentName);

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('ERROR_MSG');

        console.log(`~~~~ Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationRequestInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            //copy persistent attribute to session attributes
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);//is this a session end?
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
        exports.handler = Alexa.SkillBuilders.custom()
            .addRequestHandlers(
                LaunchRequestHandler,
                eleccionIntentHandler,
                SerieGuardadeIntenttHandler,
                recomendActorIntentHandler,
                recomendCategoriaIntentHandler,
                recomendAnioEstrenoIntentHandler,
                recomendRegionIntentHandler,
                recomendPlataformaIntentHandler,
                GuardarSerieIntentHandler,
                HelpIntentHandler,
                CancelAndStopIntentHandler,
                SessionEndedRequestHandler,
                IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
            .addRequestInterceptors(
            LocalizationRequestInterceptor,
            LoggingRequestInterceptor,
                LoadAttributesRequestInterceptor)
            .addResponseInterceptors(
                LoggingResponseInterceptor,
                SaveAttributesResponseInterceptor)
            .withPersistenceAdapter(persistenceAdapter)
            .lambda();