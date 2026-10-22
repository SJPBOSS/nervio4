import { enTopics } from './topics-en.js';
import { frTopics } from './topics-fr.js';
import { esTopics } from './topics-es.js';
import { ptTopics } from './topics-pt.js';

export const SITE = 'https://www.panicpause.com';
export const PUBLISHED = '2026-10-22';
export const LANGS = ['en', 'fr', 'es', 'pt'];

const byId = (list) => Object.fromEntries(list.map((topic) => [topic.id, topic]));
const frById = byId(frTopics);
const esById = byId(esTopics);
const ptById = byId(ptTopics);

export const TOPICS = enTopics.map((en) => ({
  id: en.id,
  mode: en.mode,
  dur: en.dur,
  en,
  fr: frById[en.id],
  es: esById[en.id],
  pt: ptById[en.id],
}));

export const BLURBS = {
  en: 'Nervio is a free breathing app for calm, focus, sleep, and moments of panic. No account. These guides are general wellness information, not medical advice.',
  fr: 'Nervio est une application gratuite de respiration pour le calme, la concentration, le sommeil et les crises de panique. Sans compte. Ces guides sont de l’information générale sur le bien-être, pas un avis médical.',
  es: 'Nervio es una aplicación gratuita de respiración para la calma, el enfoque, el sueño y los ataques de pánico. Sin cuenta. Estas guías son información general de bienestar, no consejo médico.',
  pt: 'O Nervio é um aplicativo grátis de respiração para calma, foco, sono e momentos de pânico. Sem conta. Estes guias são informação geral de bem-estar, não orientação médica.',
};

export const CHROME = {
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    skip: 'Skip to content',
    language: 'Language',
    guides: 'Guides',
    breadcrumb: 'Breadcrumb',
    other: 'Other guides',
    published: 'Published',
    date: '22 October 2026',
    column: 'English',
    openApp: 'Open the app',
    notFoundTitle: 'Page not found | Nervio',
    notFoundH1: 'This page is not here.',
    notFoundBody: 'The link may be old, or it may have been typed wrong. Nervio is still on the home page, and the guides are listed below.',
  },
  fr: {
    htmlLang: 'fr-CA',
    ogLocale: 'fr_CA',
    skip: 'Aller au contenu',
    language: 'Langue',
    guides: 'Guides',
    breadcrumb: 'Fil d’Ariane',
    other: 'Autres guides',
    published: 'Publié',
    date: '22 octobre 2026',
    column: 'Français',
    openApp: 'Ouvrir l’application',
    notFoundTitle: 'Page introuvable | Nervio',
    notFoundH1: 'Cette page n’est pas ici.',
    notFoundBody: 'Le lien est peut-être vieux, ou il a été mal écrit. Nervio est toujours à l’accueil, et les guides sont plus bas.',
  },
  es: {
    htmlLang: 'es',
    ogLocale: 'es_ES',
    skip: 'Saltar al contenido',
    language: 'Idioma',
    guides: 'Guías',
    breadcrumb: 'Miga de pan',
    other: 'Otras guías',
    published: 'Publicado',
    date: '22 de octubre de 2026',
    column: 'Español',
    openApp: 'Abrir la aplicación',
    notFoundTitle: 'Página no encontrada | Nervio',
    notFoundH1: 'Esta página no está aquí.',
    notFoundBody: 'Puede que el enlace sea viejo o que esté mal escrito. Nervio sigue en el inicio, y las guías están más abajo.',
  },
  pt: {
    htmlLang: 'pt-BR',
    ogLocale: 'pt_BR',
    skip: 'Pular para o conteúdo',
    language: 'Idioma',
    guides: 'Guias',
    breadcrumb: 'Caminho',
    other: 'Outros guias',
    published: 'Publicado',
    date: '22 de outubro de 2026',
    column: 'Português',
    openApp: 'Abrir o aplicativo',
    notFoundTitle: 'Página não encontrada | Nervio',
    notFoundH1: 'Esta página não está aqui.',
    notFoundBody: 'O link pode ser antigo ou ter sido digitado errado. O Nervio continua na página inicial, e os guias estão mais abaixo.',
  },
};

export const DISCLAIMERS = {
  en: {
    heading: 'This is not medical care',
    blocks: [
      [
        { text: 'Nervio shares general wellness information and breathing exercises. It is not medical advice, not a diagnosis, and not a substitute for professional care. Stop if you feel pain, faint, or unwell.' },
      ],
      [
        { text: 'If you are in crisis or thinking about hurting yourself, call ' },
        { href: 'tel:988', label: '988' },
        { text: ' or text ' },
        { href: 'sms:988', label: '988' },
        { text: ' in Canada (' },
        { href: 'https://988.ca/', label: '9-8-8 Suicide Crisis Helpline' },
        { text: '), any time.' },
      ],
    ],
    othersLabel: 'Other countries',
    others: [
      [
        { text: 'United States: call or text ' },
        { href: 'tel:988', label: '988' },
        { text: ' (' },
        { href: 'https://988lifeline.org/', label: '988 Suicide & Crisis Lifeline' },
        { text: ').' },
      ],
      [
        { text: 'United Kingdom and Ireland: call the Samaritans free, any time, on ' },
        { href: 'tel:116123', label: '116 123' },
        { text: ' (' },
        { href: 'https://www.samaritans.org/how-we-can-help/contact-samaritan/talk-us-phone/', label: 'Samaritans' },
        { text: ').' },
      ],
      [
        { text: 'Australia: call Lifeline any time on ' },
        { href: 'tel:131114', label: '13 11 14' },
        { text: ' (' },
        { href: 'https://www.lifeline.org.au/131114', label: 'Lifeline' },
        { text: ').' },
      ],
      [
        { text: 'New Zealand: call ' },
        { href: 'tel:080017371737', label: '0800 1737 1737' },
        { text: ' or text ' },
        { href: 'sms:1737', label: '1737' },
        { text: ', any time (' },
        { href: 'https://www.healthnz.govt.nz/health-topics/mental-health/where-to-get-help', label: '1737, Need to talk?' },
        { text: ').' },
      ],
      [
        { text: 'Somewhere else: ' },
        { href: 'https://findahelpline.com/', label: 'Find a Helpline' },
        { text: ' lists local lines.' },
      ],
    ],
    tail: [
      [
        { text: 'If this could be a medical emergency, call your local emergency number (911 in Canada and the United States, 000 in Australia, 111 in New Zealand).' },
      ],
    ],
  },
  fr: {
    heading: 'Ceci ne remplace pas des soins',
    blocks: [
      [
        { text: 'Nervio offre de l’information générale sur le bien-être et des exercices de respiration. Ce n’est pas un avis médical, ni un diagnostic, ni un substitut à des soins professionnels. Arrêtez si vous ressentez de la douleur, un malaise ou si vous vous sentez mal.' },
      ],
      [
        { text: 'Si vous êtes en détresse ou si vous pensez à vous faire du mal, au Canada composez le ' },
        { href: 'tel:988', label: '988' },
        { text: ' ou textez le ' },
        { href: 'sms:988', label: '988' },
        { text: ' (' },
        { href: 'https://988.ca/fr', label: '9-8-8 : Ligne d’aide en cas de crise de suicide' },
        { text: '), en tout temps. Au Québec, composez le ' },
        { href: 'tel:+18662773553', label: '1 866 277-3553' },
        { text: ' (1 866 APPELLE) ou textez le ' },
        { href: 'sms:535353', label: '535353' },
        { text: ' (' },
        { href: 'https://www.quebec.ca/sante/sante-mentale/s-informer-sur-sante-mentale-et-troubles-mentaux/reconnaitre-signes-detresse-et-prevenir-suicide', label: 'Gouvernement du Québec' },
        { text: '). Ces deux lignes sont gratuites.' },
      ],
    ],
    othersLabel: 'Autres pays',
    others: [
      [
        { text: 'France : appelez le ' },
        { href: 'tel:3114', label: '3114' },
        { text: ' (' },
        { href: 'https://3114.fr/', label: 'numéro national de prévention du suicide' },
        { text: ').' },
      ],
      [
        { text: 'Belgique francophone : ' },
        { href: 'tel:080032123', label: '0800 32 123' },
        { text: ', anonyme et gratuit, 24 h/24 (' },
        { href: 'https://www.preventionsuicide.be/la-ligne-decoute-0800-32-123', label: 'Centre de prévention du suicide' },
        { text: ').' },
      ],
      [
        { text: 'Suisse : le ' },
        { href: 'tel:143', label: '143' },
        { text: ', La Main Tendue, 24 h/24 (' },
        { href: 'https://www.143.ch/fr/', label: '143.ch' },
        { text: ').' },
      ],
      [
        { text: 'Côte d’Ivoire : le ' },
        { href: 'tel:143', label: '143' },
        { text: ', ligne gratuite du Programme national de santé mentale. La page du programme indique une écoute du lundi au vendredi, de 8 h à 17 h (' },
        { href: 'https://www.pnsantementale.ci/projets/dispositif-143-assistance-psychologique', label: 'Programme national de santé mentale' },
        { text: ').' },
      ],
      [
        { text: 'États-Unis : composez ou textez le ' },
        { href: 'tel:988', label: '988' },
        { text: ' (' },
        { href: 'https://988lifeline.org/', label: '988 Suicide & Crisis Lifeline' },
        { text: ').' },
      ],
      [
        { text: 'Ailleurs : ' },
        { href: 'https://findahelpline.com/', label: 'Find a Helpline' },
        { text: ' indique des lignes locales.' },
      ],
    ],
    tail: [
      [
        { text: 'S’il peut s’agir d’une urgence médicale, appelez les services d’urgence (911 au Canada et aux États-Unis, 112 en France et en Belgique).' },
      ],
    ],
  },
  es: {
    heading: 'Esto no sustituye la atención profesional',
    blocks: [
      [
        { text: 'Nervio ofrece información general de bienestar y ejercicios de respiración. No es consejo médico, ni un diagnóstico, y no sustituye la atención profesional. Para si sientes dolor, mareo o malestar.' },
      ],
      [
        { text: 'Si estás en crisis o piensas en hacerte daño, en España llama al ' },
        { href: 'tel:024', label: '024' },
        { text: ' (' },
        { href: 'https://www.sanidad.gob.es/linea024/', label: 'Línea de atención a la conducta suicida' },
        { text: ').' },
      ],
    ],
    othersLabel: 'Otros países',
    others: [
      [
        { text: 'México: Línea de la Vida, ' },
        { href: 'tel:8009112000', label: '800 911 2000' },
        { text: ', gratis, las 24 horas (' },
        { href: 'https://www.gob.mx/lineadelavida', label: 'gob.mx/lineadelavida' },
        { text: ').' },
      ],
      [
        { text: 'Colombia: línea ' },
        { href: 'tel:106', label: '106' },
        { text: ', gratis, las 24 horas (' },
        { href: 'https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx', label: 'Ministerio de Salud' },
        { text: ').' },
      ],
      [
        { text: 'Perú: línea ' },
        { href: 'tel:113', label: '113' },
        { text: ', opción 5, gratis, las 24 horas (' },
        { href: 'https://www.gob.pe/20715', label: 'Ministerio de Salud del Perú' },
        { text: ').' },
      ],
      [
        { text: 'Argentina: línea de prevención del suicidio ' },
        { href: 'tel:135', label: '135' },
        { text: ' (' },
        { href: 'https://www.argentina.gob.ar/tema/emergencias', label: 'argentina.gob.ar' },
        { text: ').' },
      ],
      [
        { text: 'Chile: ' },
        { href: 'tel:*4141', label: '*4141' },
        { text: ', gratis, las 24 horas (' },
        { href: 'https://www.gob.cl/noticias/linea-prevencion-suicidio-4141-24-horas-atencion-balance-cifras/', label: 'gob.cl' },
        { text: ').' },
      ],
      [
        { text: 'Estados Unidos, en español: llama al ' },
        { href: 'tel:988', label: '988' },
        { text: ' y presiona 2, o envía la palabra AYUDA al ' },
        { href: 'sms:988', label: '988' },
        { text: ' (' },
        { href: 'https://988lifeline.org/es/servicios-de-traduccion/servicios-en-espanol/', label: '988 Lifeline' },
        { text: ').' },
      ],
      [
        { text: 'Uruguay: ' },
        { href: 'tel:08000767', label: '0800 0767' },
        { text: ' o ' },
        { href: 'tel:*0767', label: '*0767' },
        { text: ', gratis, las 24 horas (' },
        { href: 'https://www.gub.uy/ministerio-salud-publica/salud-mental', label: 'Ministerio de Salud Pública' },
        { text: ').' },
      ],
      [
        { text: 'Ecuador: ' },
        { href: 'tel:171', label: '171' },
        { text: ', opción 6, gratis, todos los días de 7:00 a 20:00 (' },
        { href: 'https://www.salud.gob.ec/a-traves-de-la-linea-171-msp-ofrece-atencion-en-salud-mental/', label: 'Ministerio de Salud Pública' },
        { text: ').' },
      ],
      [
        { text: 'Costa Rica: Aquí Estoy, ' },
        { href: 'tel:8002737869', label: '800 273 7869' },
        { text: ', gratis. De lunes a viernes, de 14:00 a 22:00, y los sábados, de 9:00 a 16:00 (' },
        { href: 'https://aquiestoy.cr/', label: 'aquiestoy.cr' },
        { text: ').' },
      ],
      [
        { text: 'República Dominicana: Centro de Contacto Cuida tu Salud Mental, ' },
        { href: 'tel:711', label: '711' },
        { text: ', gratuito y confidencial, de 8:00 a medianoche (' },
        { href: 'https://msp.gob.do/web/?p=21208', label: 'Ministerio de Salud Pública' },
        { text: ').' },
      ],
      [
        { text: 'Canadá: llama al ' },
        { href: 'tel:988', label: '988' },
        { text: ' o envía un mensaje de texto al ' },
        { href: 'sms:988', label: '988' },
        { text: ' (' },
        { href: 'https://988.ca/', label: 'línea de crisis 9-8-8' },
        { text: '), a cualquier hora.' },
      ],
      [
        { text: 'En otros lugares: ' },
        { href: 'https://findahelpline.com/', label: 'Find a Helpline' },
        { text: ' reúne líneas locales.' },
      ],
    ],
    tail: [
      [
        { text: 'Si puede tratarse de una emergencia médica, llama a los servicios de emergencia (112 en España, 911 en Canadá, Estados Unidos y Ecuador).' },
      ],
    ],
  },
  pt: {
    heading: 'Isto não substitui um cuidado profissional',
    blocks: [
      [
        { text: 'O Nervio compartilha informação geral de bem-estar e exercícios de respiração. Não é orientação médica, nem um diagnóstico, e não substitui o acompanhamento profissional. Pare se sentir dor, tontura ou mal-estar.' },
      ],
      [
        { text: 'Se você está em crise ou pensando em se machucar, no Brasil ligue para o CVV no ' },
        { href: 'tel:188', label: '188' },
        { text: ' (' },
        { href: 'https://www.cvv.org.br/', label: 'Centro de Valorização da Vida' },
        { text: '), 24 horas, ligação gratuita.' },
      ],
    ],
    othersLabel: 'Outros países',
    others: [
      [
        { text: 'Portugal: a linha SNS 24 é ' },
        { href: 'tel:808242424', label: '808 24 24 24' },
        { text: ' (triagem e aconselhamento psicológico, 24 horas, ' },
        { href: 'https://www.sns24.gov.pt/contacte-nos/', label: 'SNS 24' },
        { text: '). A SOS Voz Amiga, apoio emocional e prevenção do suicídio, atende todos os dias das 15h30 à 00h30: ' },
        { href: 'tel:+351213544545', label: '213 544 545' },
        { text: ', ' },
        { href: 'tel:+351912802669', label: '912 802 669' },
        { text: ', ' },
        { href: 'tel:+351963524660', label: '963 524 660' },
        { text: ' e ' },
        { href: 'tel:+351930712500', label: '930 712 500' },
        { text: ' (' },
        { href: 'https://www.sosvozamiga.org/contactos', label: 'SOS Voz Amiga' },
        { text: ').' },
      ],
      [
        { text: 'Canadá: ligue para o ' },
        { href: 'tel:988', label: '988' },
        { text: ' ou envie uma mensagem de texto para o ' },
        { href: 'sms:988', label: '988' },
        { text: ' (' },
        { href: 'https://988.ca/', label: 'linha de crise 9-8-8' },
        { text: '), a qualquer hora.' },
      ],
      [
        { text: 'Estados Unidos: ligue ou envie uma mensagem de texto para o ' },
        { href: 'tel:988', label: '988' },
        { text: ' (' },
        { href: 'https://988lifeline.org/', label: '988 Suicide & Crisis Lifeline' },
        { text: ').' },
      ],
      [
        { text: 'Em outros lugares: o ' },
        { href: 'https://findahelpline.com/', label: 'Find a Helpline' },
        { text: ' lista linhas locais.' },
      ],
    ],
    tail: [
      [
        { text: 'Se isto pode ser uma emergência médica, ligue para o serviço de emergência (192 do SAMU no Brasil, 112 em Portugal, 911 no Canadá e nos Estados Unidos).' },
      ],
    ],
  },
};

export function pagePath(topic, lang) {
  return `/${lang}/${topic[lang].slug}/`;
}
