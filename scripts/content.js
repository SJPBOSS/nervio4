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
        { text: '), any time, day or night. In the United States, call or text 988 (' },
        { href: 'https://988lifeline.org/', label: '988 Suicide & Crisis Lifeline' },
        { text: '). If you are somewhere else, contact your local emergency number or crisis line.' },
      ],
      [
        { text: 'If this could be a medical emergency, call your local emergency number (911 in Canada and the United States).' },
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
        { text: 'Si vous êtes en détresse ou si vous pensez à vous faire du mal, composez le ' },
        { href: 'tel:988', label: '988' },
        { text: ' ou textez le ' },
        { href: 'sms:988', label: '988' },
        { text: ' au Canada (' },
        { href: 'https://988.ca/fr', label: '9-8-8 : Ligne d’aide en cas de crise de suicide' },
        { text: '), en tout temps. Aux États-Unis, composez ou textez le 988. En France, appelez le ' },
        { href: 'tel:3114', label: '3114' },
        { text: ' (' },
        { href: 'https://3114.fr/', label: 'numéro national de prévention du suicide' },
        { text: '). Ailleurs, contactez les services d’urgence ou la ligne de crise de votre région.' },
      ],
      [
        { text: 'S’il peut s’agir d’une urgence médicale, appelez les services d’urgence (911 au Canada et aux États-Unis, 112 en France).' },
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
        { text: 'Si estás en crisis o piensas en hacerte daño, llama al ' },
        { href: 'tel:988', label: '988' },
        { text: ' o envía un mensaje de texto al ' },
        { href: 'sms:988', label: '988' },
        { text: ' en Canadá (' },
        { href: 'https://988.ca/', label: 'línea de crisis 9-8-8' },
        { text: '), a cualquier hora. En Estados Unidos, llama o envía un mensaje de texto al 988 (' },
        { href: 'https://988lifeline.org/', label: '988 Suicide & Crisis Lifeline' },
        { text: '). En España, llama al ' },
        { href: 'tel:024', label: '024' },
        { text: ' (' },
        { href: 'https://www.sanidad.gob.es/linea024/', label: 'Línea de atención a la conducta suicida' },
        { text: '). En México, llama a la Línea de la Vida al ' },
        { href: 'tel:8009112000', label: '800 911 2000' },
        { text: ' (gratis, las 24 horas, ' },
        { href: 'https://www.gob.mx/lineadelavida', label: 'gob.mx/lineadelavida' },
        { text: '). En Colombia, llama a la Línea ' },
        { href: 'tel:106', label: '106' },
        { text: ' (gratis, las 24 horas, ' },
        { href: 'https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx', label: 'Ministerio de Salud' },
        { text: '). En Perú, llama gratis a la Línea ' },
        { href: 'tel:113', label: '113' },
        { text: ', opción 5, las 24 horas (' },
        { href: 'https://www.gob.pe/20715', label: 'Ministerio de Salud del Perú' },
        { text: '). En Argentina, la línea de prevención del suicidio es el ' },
        { href: 'tel:135', label: '135' },
        { text: ' (' },
        { href: 'https://www.argentina.gob.ar/tema/emergencias', label: 'argentina.gob.ar' },
        { text: '). En Chile, llama al ' },
        { href: 'tel:*4141', label: '*4141' },
        { text: ' (gratis, las 24 horas, ' },
        { href: 'https://www.gob.cl/noticias/linea-prevencion-suicidio-4141-24-horas-atencion-balance-cifras/', label: 'gob.cl' },
        { text: '). En otros lugares, contacta los servicios de emergencia o la línea de crisis local.' },
      ],
      [
        { text: 'Si puede tratarse de una emergencia médica, llama a los servicios de emergencia (911 en Canadá y Estados Unidos, 112 en España).' },
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
        { text: 'Se você está em crise ou pensando em se machucar, ligue para o ' },
        { href: 'tel:988', label: '988' },
        { text: ' ou envie uma mensagem de texto para o ' },
        { href: 'sms:988', label: '988' },
        { text: ' no Canadá (' },
        { href: 'https://988.ca/', label: 'linha de crise 9-8-8' },
        { text: '), a qualquer hora. Nos Estados Unidos, ligue ou envie uma mensagem de texto para o 988 (' },
        { href: 'https://988lifeline.org/', label: '988 Suicide & Crisis Lifeline' },
        { text: '). No Brasil, ligue para o CVV no ' },
        { href: 'tel:188', label: '188' },
        { text: ' (' },
        { href: 'https://www.cvv.org.br/', label: 'Centro de Valorização da Vida' },
        { text: '), 24 horas, ligação gratuita. Em outros lugares, procure o número de emergência ou a linha de crise da sua região.' },
      ],
      [
        { text: 'Se isto pode ser uma emergência médica, ligue para o serviço de emergência (911 no Canadá e nos Estados Unidos, 192 do SAMU no Brasil).' },
      ],
    ],
  },
};

export function pagePath(topic, lang) {
  return `/${lang}/${topic[lang].slug}/`;
}
