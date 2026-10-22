export const CHECKED_DATE = '2026-10';

export const CHECKED = {
  en: 'Last checked: October 2026',
  fr: 'Dernière vérification : octobre 2026',
  es: 'Última revisión: octubre de 2026',
  pt: 'Última verificação: outubro de 2026',
};

export const SHORT = {
  en: {
    line: 'Nervio is a breathing timer for general wellness. It is not medical advice, diagnosis or treatment, and not for emergencies. If you are in crisis, call your local emergency number or a crisis line.',
    stop: 'Stop if you feel dizzy or light-headed; if you have a heart, lung or other medical condition or are pregnant, check with a doctor first.',
  },
  fr: {
    line: 'Nervio est un minuteur de respiration pour le bien-être en général. Ce n’est pas un avis médical, un diagnostic ou un traitement, et ce n’est pas pour les urgences. Si vous êtes en crise, appelez le numéro d’urgence local ou une ligne de crise.',
    stop: 'Arrêtez si vous avez des étourdissements ou la tête légère. Si vous avez un problème de cœur, de poumons ou un autre problème de santé, ou si vous êtes enceinte, parlez-en d’abord à un médecin.',
  },
  es: {
    line: 'Nervio es un temporizador de respiración para el bienestar general. No es consejo médico, ni diagnóstico, ni tratamiento, y no es para emergencias. Si estás en crisis, llama a tu número de emergencia local o a una línea de crisis.',
    stop: 'Para si notas mareo o la cabeza ligera. Si tienes un problema de corazón, de pulmones u otra condición de salud, o si estás embarazada, consulta a un médico antes.',
  },
  pt: {
    line: 'O Nervio é um cronômetro de respiração para o bem-estar em geral. Não é orientação médica, nem diagnóstico, nem tratamento, e não é para emergências. Se você está em crise, ligue para o número de emergência local ou para uma linha de crise.',
    stop: 'Pare se sentir tontura ou a cabeça leve. Se você tem um problema no coração, nos pulmões ou outra condição de saúde, ou se está grávida, fale com um médico antes.',
  },
};

export const LINK_LABELS = {
  en: { terms: 'Terms and disclaimer', privacy: 'Privacy', legal: 'Legal' },
  fr: { terms: 'Conditions et avis', privacy: 'Confidentialité', legal: 'Mentions' },
  es: { terms: 'Términos y aviso', privacy: 'Privacidad', legal: 'Aviso legal' },
  pt: { terms: 'Termos e aviso', privacy: 'Privacidade', legal: 'Avisos' },
};

export const LEGAL_SLUGS = {
  terms: { en: 'terms', fr: 'conditions', es: 'aviso', pt: 'aviso' },
  privacy: { en: 'privacy', fr: 'confidentialite', es: 'privacidad', pt: 'privacidade' },
};

export function legalPath(kind, lang) {
  return `/${lang}/${LEGAL_SLUGS[kind][lang]}/`;
}

const privacyLink = {
  en: '[Privacy](/en/privacy/)',
  fr: '[Confidentialité](/fr/confidentialite/)',
  es: '[Privacidad](/es/privacidad/)',
  pt: '[Privacidade](/pt/privacidade/)',
};

const termsLink = {
  en: '[Terms and disclaimer](/en/terms/)',
  fr: '[Conditions et avis](/fr/conditions/)',
  es: '[Términos y aviso](/es/aviso/)',
  pt: '[Termos e aviso](/pt/aviso/)',
};

export const LEGAL_PAGES = {
  en: {
    terms: {
      title: 'Terms and disclaimer | Nervio',
      description: 'Nervio is a free breathing timer for general wellness. It is not medical advice, it is not for emergencies, and it is provided as it is.',
      h1: 'Terms and disclaimer',
      sections: [
        {
          h2: 'Not medical advice',
          paragraphs: [
            SHORT.en.line,
            'The written guides are general wellness information. They do not tell you what a feeling is, and they are not a substitute for professional care.',
          ],
        },
        {
          h2: 'Your own risk',
          paragraphs: [
            SHORT.en.stop,
            'You decide whether to use Nervio. You use the timer and the guides at your own risk.',
          ],
        },
        {
          h2: 'Not for emergencies',
          paragraphs: [
            'Nervio is not for emergencies. If you might need urgent help, call your local emergency number. If you are in crisis or thinking about hurting yourself, use a crisis line. The lines below are public lines, not part of the timer.',
          ],
          crisis: true,
        },
        {
          h2: 'Free, and as it is',
          paragraphs: [
            'Nervio is free of charge. It is provided as it is. There is no promise that it will always be available, that a count will feel right on every phone, or that it will fit a particular need.',
          ],
        },
        {
          h2: 'Limit on responsibility',
          paragraphs: [
            'To the extent the law allows, the people who make and share Nervio are not responsible for loss, injury, or damage connected with using the site, the timer, or the guides, or with not being able to use them. Where a limit like this is not allowed, it applies only as far as it can.',
          ],
        },
        {
          h2: 'Privacy',
          paragraphs: [
            `A separate page says what is stored on your device and what a normal page request includes. ${privacyLink.en}`,
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacy | Nervio',
      description: 'Nervio stores a small note in this browser’s local storage. It does not run analytics or set cookies.',
      h1: 'Privacy',
      sections: [
        {
          h2: 'What stays on this device',
          paragraphs: [
            'Nervio has no account. The app saves one note in this browser’s local storage, under the key “nervio”. That note holds:',
          ],
          steps: [
            'a version number for the note (1)',
            'your language',
            'the last mode (Calm, Focus, Sleep, or Reset)',
            'the duration you last chose',
            'whether the sound is muted',
            'a difficulty number',
            'how many sessions you have finished',
          ],
          after: [
            'The difficulty number is a local offset. After you tap Better or Worse, it can make the timed counts a little longer or shorter. Reset ignores it. The note stays in that browser on that device. The app code does not send it.',
          ],
        },
        {
          h2: 'What a visit sends',
          paragraphs: [
            'These pages do not run analytics and do not set cookies. Fonts, styles, scripts, and icons come from this same site. There is no third-party script, font, or image.',
            'Opening a page asks the host, GitHub Pages, for that address. A normal request includes the address you opened. The address can include lang, mode, and dur, so a shared link opens the same setup. The app writes those three values into the address. It does not make a separate tracking request.',
            'The breathing chime, if you leave the sound on, is made in the browser. It is not recorded and not sent.',
          ],
        },
        {
          h2: 'When you leave',
          paragraphs: [
            'A crisis line or other official link leaves Nervio only if you choose it. That site has its own practices. The saved note is not sent with the click.',
          ],
        },
        {
          h2: 'Clearing the note',
          paragraphs: [
            'Clear the site data for this site in your browser to remove the “nervio” note. The app then starts from its defaults, or from the language and setup in the link you opened.',
            `The fuller notice about the timer is on the terms page. ${termsLink.en}`,
          ],
        },
      ],
    },
  },
  fr: {
    terms: {
      title: 'Conditions et avis | Nervio',
      description: 'Nervio est un minuteur de respiration gratuit pour le bien-être. Ce n’est pas un avis médical, ce n’est pas pour les urgences, et il est offert tel quel.',
      h1: 'Conditions et avis',
      sections: [
        {
          h2: 'Pas un avis médical',
          paragraphs: [
            SHORT.fr.line,
            'Les guides écrits sont de l’information générale sur le bien-être. Ils ne vous disent pas ce qu’est une sensation, et ils ne remplacent pas des soins professionnels.',
          ],
        },
        {
          h2: 'À vos risques',
          paragraphs: [
            SHORT.fr.stop,
            'Vous décidez d’utiliser Nervio ou non. Vous utilisez le minuteur et les guides à vos propres risques.',
          ],
        },
        {
          h2: 'Pas pour les urgences',
          paragraphs: [
            'Nervio n’est pas pour les urgences. Si vous pourriez avoir besoin d’aide urgente, appelez le numéro d’urgence local. Si vous êtes en détresse ou si vous pensez à vous faire du mal, utilisez une ligne de crise. Les lignes ci-dessous sont des lignes publiques, pas une partie du minuteur.',
          ],
          crisis: true,
        },
        {
          h2: 'Gratuit, et tel quel',
          paragraphs: [
            'Nervio est gratuit. Il est offert tel quel. Il n’y a pas de promesse qu’il sera toujours disponible, qu’un décompte semblera juste sur chaque téléphone, ou qu’il conviendra à un besoin précis.',
          ],
        },
        {
          h2: 'Limite de responsabilité',
          paragraphs: [
            'Dans la mesure où la loi le permet, les personnes qui font et partagent Nervio ne sont pas responsables des pertes, blessures ou dommages liés à l’utilisation du site, du minuteur ou des guides, ni à l’impossibilité de les utiliser. Là où une limite comme celle-ci n’est pas permise, elle s’applique seulement aussi loin qu’elle le peut.',
          ],
        },
        {
          h2: 'Confidentialité',
          paragraphs: [
            `Une page à part dit ce qui est gardé sur votre appareil et ce qu’une visite normale envoie. ${privacyLink.fr}`,
          ],
        },
      ],
    },
    privacy: {
      title: 'Confidentialité | Nervio',
      description: 'Nervio garde une petite note dans le stockage local de ce navigateur. Il n’y a pas d’analytique et pas de témoin.',
      h1: 'Confidentialité',
      sections: [
        {
          h2: 'Ce qui reste sur cet appareil',
          paragraphs: [
            'Nervio n’a pas de compte. L’application enregistre une note dans le stockage local de ce navigateur, sous la clé « nervio ». Cette note contient :',
          ],
          steps: [
            'un numéro de version de la note (1)',
            'votre langue',
            'le dernier mode (Calme, Concentration, Sommeil ou Recentrage)',
            'la durée choisie en dernier',
            'si le son est coupé',
            'un nombre de difficulté',
            'combien de séances vous avez terminées',
          ],
          after: [
            'Le nombre de difficulté est un décalage local. Après Mieux ou Moins bien, il peut rendre les décomptes minutés un peu plus longs ou plus courts. Recentrage l’ignore. La note reste dans ce navigateur, sur cet appareil. Le code de l’application ne l’envoie pas.',
          ],
        },
        {
          h2: 'Ce qu’une visite envoie',
          paragraphs: [
            'Ces pages ne font pas d’analytique et ne déposent pas de témoin (cookie). Les polices, les styles, les scripts et les icônes viennent de ce même site. Il n’y a pas de script, de police ou d’image d’un tiers.',
            'Ouvrir une page demande cette adresse à l’hébergeur, GitHub Pages. Une demande normale inclut l’adresse ouverte. L’adresse peut contenir lang, mode et dur, pour qu’un lien partagé ouvre le même réglage. L’application écrit ces trois valeurs dans l’adresse. Elle ne fait pas une demande de suivi à part.',
            'Le son de respiration, si vous le laissez activé, est produit dans le navigateur. Il n’est pas enregistré et il n’est pas envoyé.',
          ],
        },
        {
          h2: 'Quand vous quittez le site',
          paragraphs: [
            'Une ligne de crise ou un autre lien officiel quitte Nervio seulement si vous le choisissez. Ce site a ses propres pratiques. La note enregistrée n’est pas envoyée avec le clic.',
          ],
        },
        {
          h2: 'Effacer la note',
          paragraphs: [
            'Effacez les données du site dans votre navigateur pour retirer la note « nervio ». L’application repart alors de ses réglages de base, ou de la langue et du réglage dans le lien que vous avez ouvert.',
            `L’avis plus complet sur le minuteur est sur la page des conditions. ${termsLink.fr}`,
          ],
        },
      ],
    },
  },
  es: {
    terms: {
      title: 'Términos y aviso | Nervio',
      description: 'Nervio es un temporizador de respiración gratis para el bienestar. No es consejo médico, no es para emergencias y se ofrece tal como está.',
      h1: 'Términos y aviso',
      sections: [
        {
          h2: 'No es consejo médico',
          paragraphs: [
            SHORT.es.line,
            'Las guías escritas son información general de bienestar. No te dicen qué es una sensación y no sustituyen la atención profesional.',
          ],
        },
        {
          h2: 'Por tu cuenta',
          paragraphs: [
            SHORT.es.stop,
            'Tú decides si usas Nervio. Usas el temporizador y las guías por tu cuenta y riesgo.',
          ],
        },
        {
          h2: 'No es para emergencias',
          paragraphs: [
            'Nervio no es para emergencias. Si puedes necesitar ayuda urgente, llama a tu número de emergencia local. Si estás en crisis o piensas en hacerte daño, usa una línea de crisis. Las líneas de abajo son líneas públicas, no parte del temporizador.',
          ],
          crisis: true,
        },
        {
          h2: 'Gratis, y tal como está',
          paragraphs: [
            'Nervio es gratis. Se ofrece tal como está. No hay promesa de que siempre esté disponible, de que una cuenta se sienta bien en cada teléfono, o de que sirva para una necesidad concreta.',
          ],
        },
        {
          h2: 'Límite de responsabilidad',
          paragraphs: [
            'Hasta donde la ley lo permite, las personas que hacen y comparten Nervio no son responsables de pérdidas, lesiones o daños relacionados con usar el sitio, el temporizador o las guías, ni con no poder usarlos. Donde un límite así no se permite, se aplica solo hasta donde puede.',
          ],
        },
        {
          h2: 'Privacidad',
          paragraphs: [
            `Una página aparte dice qué se guarda en tu dispositivo y qué incluye una visita normal. ${privacyLink.es}`,
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacidad | Nervio',
      description: 'Nervio guarda una nota pequeña en el almacenamiento local de este navegador. No usa analítica ni guarda cookies.',
      h1: 'Privacidad',
      sections: [
        {
          h2: 'Qué se queda en este dispositivo',
          paragraphs: [
            'Nervio no tiene cuenta. La aplicación guarda una nota en el almacenamiento local de este navegador, bajo la clave «nervio». Esa nota contiene:',
          ],
          steps: [
            'un número de versión de la nota (1)',
            'tu idioma',
            'el último modo (Calma, Enfoque, Sueño o Reinicio)',
            'la duración que elegiste al final',
            'si el sonido está silenciado',
            'un número de dificultad',
            'cuántas sesiones has terminado',
          ],
          after: [
            'El número de dificultad es un ajuste local. Después de Mejor o Peor, puede hacer las cuentas con tiempo un poco más largas o más cortas. Reinicio lo ignora. La nota se queda en ese navegador, en ese dispositivo. El código de la aplicación no la envía.',
          ],
        },
        {
          h2: 'Qué envía una visita',
          paragraphs: [
            'Estas páginas no usan analítica y no guardan cookies. Las fuentes, los estilos, los scripts y los iconos vienen de este mismo sitio. No hay un script, una fuente ni una imagen de un tercero.',
            'Abrir una página pide esa dirección al alojamiento, GitHub Pages. Una petición normal incluye la dirección que abriste. La dirección puede incluir lang, mode y dur, para que un enlace compartido abra el mismo ajuste. La aplicación escribe esos tres valores en la dirección. No hace una petición de seguimiento aparte.',
            'El sonido de la respiración, si lo dejas activado, se hace en el navegador. No se graba y no se envía.',
          ],
        },
        {
          h2: 'Cuando sales',
          paragraphs: [
            'Una línea de crisis u otro enlace oficial sale de Nervio solo si tú lo eliges. Ese sitio tiene sus propias prácticas. La nota guardada no se envía con el clic.',
          ],
        },
        {
          h2: 'Borrar la nota',
          paragraphs: [
            'Borra los datos del sitio en tu navegador para quitar la nota «nervio». La aplicación vuelve entonces a sus ajustes de inicio, o al idioma y al ajuste del enlace que abriste.',
            `El aviso más completo sobre el temporizador está en la página de términos. ${termsLink.es}`,
          ],
        },
      ],
    },
  },
  pt: {
    terms: {
      title: 'Termos e aviso | Nervio',
      description: 'O Nervio é um cronômetro de respiração grátis para o bem-estar. Não é orientação médica, não é para emergências e é oferecido como está.',
      h1: 'Termos e aviso',
      sections: [
        {
          h2: 'Não é orientação médica',
          paragraphs: [
            SHORT.pt.line,
            'Os guias escritos são informação geral de bem-estar. Eles não dizem o que uma sensação é e não substituem o acompanhamento profissional.',
          ],
        },
        {
          h2: 'Por sua conta',
          paragraphs: [
            SHORT.pt.stop,
            'Você decide se usa o Nervio. Você usa o cronômetro e os guias por sua conta e risco.',
          ],
        },
        {
          h2: 'Não é para emergências',
          paragraphs: [
            'O Nervio não é para emergências. Se você pode precisar de ajuda urgente, ligue para o número de emergência local. Se você está em crise ou pensando em se machucar, use uma linha de crise. As linhas abaixo são linhas públicas, não parte do cronômetro.',
          ],
          crisis: true,
        },
        {
          h2: 'Grátis, e como está',
          paragraphs: [
            'O Nervio é grátis. Ele é oferecido como está. Não há promessa de que ele sempre vai estar disponível, de que uma contagem vai parecer certa em cada telefone, ou de que ele vai servir para uma necessidade específica.',
          ],
        },
        {
          h2: 'Limite de responsabilidade',
          paragraphs: [
            'Na medida em que a lei permite, as pessoas que fazem e compartilham o Nervio não são responsáveis por perdas, lesões ou danos ligados ao uso do site, do cronômetro ou dos guias, nem à impossibilidade de usá-los. Onde um limite assim não é permitido, ele vale só até onde pode.',
          ],
        },
        {
          h2: 'Privacidade',
          paragraphs: [
            `Uma página separada diz o que fica no seu dispositivo e o que uma visita normal inclui. ${privacyLink.pt}`,
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacidade | Nervio',
      description: 'O Nervio guarda uma nota pequena no armazenamento local deste navegador. Não há analítica e não há cookies.',
      h1: 'Privacidade',
      sections: [
        {
          h2: 'O que fica neste dispositivo',
          paragraphs: [
            'O Nervio não tem conta. O aplicativo guarda uma nota no armazenamento local deste navegador, sob a chave “nervio”. Essa nota contém:',
          ],
          steps: [
            'um número de versão da nota (1)',
            'seu idioma',
            'o último modo (Calma, Foco, Sono ou Reinício)',
            'a duração que você escolheu por último',
            'se o som está silenciado',
            'um número de dificuldade',
            'quantas sessões você terminou',
          ],
          after: [
            'O número de dificuldade é um ajuste local. Depois de Melhor ou Pior, ele pode deixar as contagens com tempo um pouco mais longas ou mais curtas. Reinício ignora esse número. A nota fica nesse navegador, nesse dispositivo. O código do aplicativo não envia a nota.',
          ],
        },
        {
          h2: 'O que uma visita envia',
          paragraphs: [
            'Estas páginas não usam analítica e não gravam cookies. As fontes, os estilos, os scripts e os ícones vêm deste mesmo site. Não há script, fonte nem imagem de terceiros.',
            'Abrir uma página pede esse endereço ao hospedeiro, GitHub Pages. Um pedido normal inclui o endereço que você abriu. O endereço pode incluir lang, mode e dur, para um link compartilhado abrir o mesmo ajuste. O aplicativo escreve esses três valores no endereço. Ele não faz um pedido de rastreamento separado.',
            'O som da respiração, se você deixar ligado, é feito no navegador. Ele não é gravado e não é enviado.',
          ],
        },
        {
          h2: 'Quando você sai',
          paragraphs: [
            'Uma linha de crise ou outro link oficial sai do Nervio só se você escolher. Esse site tem as próprias práticas. A nota salva não é enviada com o clique.',
          ],
        },
        {
          h2: 'Apagar a nota',
          paragraphs: [
            'Apague os dados do site no seu navegador para remover a nota “nervio”. O aplicativo volta então aos ajustes iniciais, ou ao idioma e ao ajuste do link que você abriu.',
            `O aviso mais completo sobre o cronômetro está na página de termos. ${termsLink.pt}`,
          ],
        },
      ],
    },
  },
};
