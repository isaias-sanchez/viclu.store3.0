export type EditorialPage = 'barranquilla' | 'guia' | 'compras';
export interface StoreQuestion { question: string; answer: string; }

export const STORE_DESCRIPTION = 'VICLU.STORE es una tienda online de gorras de estilo urbano en Colombia. El catálogo incluye gorras beisboleras, camioneras, multimarca y Selección Colombia. Los pedidos y los envíos se coordinan por WhatsApp; no tenemos local abierto al público.';

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Beisboleras: 'Gorras beisboleras para completar tu estilo urbano. Compara los modelos y sus fotos, abre la ficha que te interesa y confirma sus medidas y ajuste por WhatsApp antes de comprar.',
  Camioneras: 'Explora la colección de gorras camioneras de VICLU.STORE. Revisa el diseño de cada modelo en sus fotos y consulta el tipo de cierre, las medidas y la disponibilidad con la tienda.',
  Multimarca: 'Compara los diseños de la colección multimarca en un solo catálogo. Cada ficha muestra la marca, el modelo y su precio; consulta los detalles de la pieza que te interesa.',
  'Selección Colombia': 'Encuentra los modelos de gorras de la colección Selección Colombia disponibles en la tienda. Revisa sus fotos y consulta por WhatsApp el ajuste, el precio y las opciones de envío.',
};

export const EDITORIAL_PAGES = {
  barranquilla: {
    path: '/gorras-en-barranquilla', title: 'Gorras en Barranquilla: compra online | VICLU.STORE',
    description: 'Compra gorras online con envío a Barranquilla. Explora beisboleras y camioneras, revisa fotos y precios y confirma tu pedido por WhatsApp en VICLU.STORE.',
    eyebrow: 'TU CIUDAD. TU HISTORIA. / COMPRA ONLINE', heading: 'GORRAS EN', accent: 'BARRANQUILLA.',
    intro: 'Gorras en Barranquilla, desde donde estés. Elige en nuestro catálogo online y coordina tu pedido por WhatsApp.',
    questions: [
      { question: '¿Dónde comprar gorras online con envío a Barranquilla?', answer: 'En VICLU.STORE puedes consultar gorras beisboleras, camioneras, multimarca y Selección Colombia. Elige una ficha del catálogo y escribe por WhatsApp para confirmar disponibilidad, precio y envío a Barranquilla antes de pagar.' },
      { question: '¿VICLU.STORE tiene un local en Barranquilla?', answer: 'VICLU.STORE funciona exclusivamente por internet. No tenemos local abierto al público. Consulta por WhatsApp las opciones y los detalles de entrega de tu pedido.' },
      { question: '¿Cuánto cuesta el envío y cuándo llega a Barranquilla?', answer: 'El costo y el plazo se confirman por WhatsApp para tu destino y pedido. Indica tu ciudad y consulta la cobertura para tu dirección antes de comprar.' },
      { question: '¿Cómo confirmo el modelo que quiero comprar?', answer: 'Abre la ficha de la gorra y pulsa Consultar por WhatsApp. El mensaje identifica el producto y su precio. Solicita confirmación del stock, medidas, cierre, forma de pago y total con envío antes de realizar el pedido.' },
    ],
  },
  guia: {
    path: '/guia-de-gorras', title: 'Cómo elegir una gorra: modelos y ajuste | VICLU.STORE',
    description: 'Guía para elegir una gorra en VICLU.STORE: compara colecciones, revisa las fotos y confirma medidas, cierre y ajuste antes de comprar online.',
    eyebrow: 'GUÍA VICLU / ELIGE CON CRITERIO', heading: 'ENCUENTRA', accent: 'TU AJUSTE.',
    intro: 'El diseño te llama la atención. Los detalles te ayudan a decidir. Compara modelos y pregunta por el ajuste antes de hacer tu pedido.',
    questions: [
      { question: '¿Cómo elegir una gorra al comprar por internet?', answer: 'Compara las fotos del modelo, revisa los datos de su ficha y confirma medidas, cierre y ajuste con la tienda. En VICLU.STORE puedes preguntar por la gorra concreta desde su botón de WhatsApp antes de comprar.' },
      { question: '¿Todas las gorras son ajustables o de talla única?', answer: 'No asumimos que todos los modelos tengan el mismo ajuste. El tipo de cierre y las medidas deben confirmarse para cada gorra por WhatsApp. Una foto o el nombre de la colección no sustituyen esa comprobación.' },
      { question: '¿Cómo puedo medir mi cabeza para consultar el ajuste?', answer: 'Usa una cinta métrica flexible alrededor de la cabeza, a la altura en la que llevarías la gorra, sin apretarla. Comparte la medida en centímetros con la tienda para comprobar si el modelo que elegiste puede ajustarse.' },
      { question: '¿El catálogo incluye gorros de lana?', answer: 'El catálogo actual de VICLU.STORE está dedicado a gorras con visera. Si buscas gorros de lana u otro tipo de accesorio, consulta a la tienda su disponibilidad antes de realizar un pedido.' },
    ],
  },
  compras: {
    path: '/envios-y-compras', title: 'Pedidos, contacto y envíos en Colombia | VICLU.STORE',
    description: 'Conoce cómo pedir una gorra en VICLU.STORE. Tienda exclusivamente online, atención por WhatsApp y envío a Barranquilla y otras ciudades de Colombia.',
    eyebrow: 'TIENDA ONLINE / ATENCIÓN DIRECTA', heading: 'TU PEDIDO,', accent: 'TODO CLARO.',
    intro: 'VICLU.STORE es una tienda online de gorras. Te atendemos por WhatsApp para confirmar la pieza que elegiste y coordinar su envío en Colombia.',
    questions: [
      { question: '¿Cómo se realiza un pedido en VICLU.STORE?', answer: 'Elige una gorra del catálogo y abre el botón Consultar por WhatsApp de su ficha. Confirma con la tienda la disponibilidad, las características, la forma de pago, el costo del envío y el total antes de completar la compra.' },
      { question: '¿Dónde puedo contactar a VICLU.STORE?', answer: 'Puedes contactar a VICLU.STORE por el enlace de WhatsApp de esta página o desde cualquier ficha de producto. El perfil de Instagram de la tienda también está enlazado aquí. No tenemos local abierto al público.' },
      { question: '¿El precio de la gorra incluye el envío?', answer: 'El catálogo muestra el precio de cada producto en COP. Consulta por WhatsApp el costo del envío a tu destino y confirma el total de la compra antes de pagar; no des por incluido el transporte en el precio mostrado.' },
      { question: '¿Dónde consulto las condiciones de cambios y devoluciones?', answer: 'Solicita a la tienda las condiciones aplicables a tu pedido por WhatsApp antes de pagar. Confirma también qué hacer si la gorra recibida presenta un problema.' },
    ],
  },
} satisfies Record<EditorialPage, { path: string; title: string; description: string; eyebrow: string; heading: string; accent: string; intro: string; questions: StoreQuestion[] }>;
