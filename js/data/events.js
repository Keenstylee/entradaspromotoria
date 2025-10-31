/**
 * Base de datos de eventos
 * 
 * Para agregar un nuevo evento, simplemente agrega un objeto al array con:
 * - id: identificador único del evento
 * - title: nombre del evento
 * - date: fecha del evento
 * - location: lugar donde se realizará
 * - image: URL de la imagen
 * - category: categoría del evento (música, comedia, arte, etc.)
 * - whatsappGroupUrl: (Opcional) URL de invitación a un grupo de WhatsApp relacionado con el evento.
 */

export const events = [
    {
        id: 1,
        title: "CARLCOX",
        description: "¡El rey está de regreso! 👑<br><br>CarlCox se apodera de nuestra ciudad este 16 de noviembre para nuestro primer sunset open air en Paradiso Perú.<br>Un viaje sonoro comandado por la leyenda más grande del techno.🔥",
        date: "15 de noviembre, 2025",
        location: "Paradiso Lima",
        image: "img/eventos/evento-1.jpg",
        category: "música",
        tickets: [
            { type: "GENERAL", price: 150.00, description: "" },
            { type: "VIP", price: 280.00, description: "" },
        ],
        whatsappGroupUrl: "https://chat.whatsapp.com/FSqdcANzG6WGXbipiu9rRo"
    },
    {
        id: 2,
        title: "RESISTANCE",
        description: "Vuelve el poder, la energía y la conexión que solo RESISTANCE puede crear.<br>Este 5 de diciembre, prepárate para vivirlo al máximo. 🔥",
        date: "05 de diciembre, 2025",
        location: "Club Cultural Lima",
        image: "img/eventos/evento-2.png",
        category: "música",
        tickets: [
            { type: "GENERAL", price: 85.00, description: "" },
            { type: "VIP", price: 125.00, description: "" },
            { type: "DJ BOOTH", price: 285.00, description: "" },
        ],
        whatsappGroupUrl: "https://chat.whatsapp.com/EFU0tT7GmrN4fjGYIJ8EFs"
    },
    {
        id: 3,
        title: "DALEX",
        description: "🎪 LA CARPA SE ABRE…<br>Ya no es solo un rumor. Bubu está lista.<br>La noche más oscura del año se acerca...<br>📍 Lima – 31 de octubre 2025<br>🎶 2 zonas musicales: Electrónica & Pachanga<br>🔥 👉 Lo que viene no es normal.",
        date: "31 de octubre, 2025",
        location: "Paradiso Lima - Club Cultural Chorrillos",
        image: "img/eventos/evento-3.webp",
        category: "música",
        tickets: [
            { type: "BUBUX", price: 50.00, description: "" },
            { type: "VIP", price: 60.00, description: "" },
        ],
        whatsappGroupUrl: "https://chat.whatsapp.com/GQFKKNLr5a614OFhy7HKk8"
    },
    {
        id: 4,
        title: "HALLOWEEN MANSION",
        description: "QUINTA EDICIÓN 31.10.2025<br>📍 TOURICAMP",
        date: "31 de Octubre, 2025",
        location: "Touricamp",
        image: "img/eventos/evento-4.webp",
        category: "música",
        tickets: [
            { type: "GENERAL", price: 60.00, description: "" },
            { type: "VIP", price: 130.00, description: "" },
        ],
        whatsappGroupUrl: "https://chat.whatsapp.com/GQFKKNLr5a614OFhy7HKk8"
    },
    {
        id: 5,
        title: "PAUL VANDYK",
        description: "📣¡𝗣𝗔𝗨𝗟 VAN DYK REGRESA A LIMA!🌌 Desde Berlín, llega el maestro que revolucionó la música electrónica, el ícono que marcó generaciones y escribió la historia del trance en cada escenario del planeta está de regreso con su tour “THIS WORLD IS OURS” 🎶🔥<br>🎧El DJ y productor alemán @paulvandyk llega a Lima el próximo viernes 14 de Noviembre para un viaje sonoro cargado de energía de inicio a fin 🔊",
        date: "14 de noviembre, 2025",
        location: "CC. Scencia",
        image: "img/eventos/evento-5.jpg",
        category: "música",
        tickets: [
            { type: "GENERAL 10PM", price: 100.00, description: "" },
            { type: "GENERAL", price: 134.00, description: "" },
            { type: "SUPERVIP", price: 224.00, description: "" },
            { type: "DJ BOOTH", price: 314.00, description: "" },
        ],
        whatsappGroupUrl: "https://chat.whatsapp.com/GQFKKNLr5a614OFhy7HKk8"
    },
    {
        id: 6,
        title: "BORIS BREJCHA",
        description: "🎭 Boris Brejcha, uno de los referentes más importantes de la escena electrónica global regresa a Lima con su show Reflections.<br>El pionero del high-tech minimal y fundador del sello Fckng Serious, presentará un show exclusivo en Paradiso Lima, con producción de primer nivel y una experiencia sonora inmersiva.<br>Lo acompañarán Moritz Hofbauer y el dúo Frieder & Jakob, también de la familia Fckng Serious.",
        date: "12 de diciembre, 2025",
        location: "Paradiso Lima - Club Cultural Chorrillos",
        image: "img/eventos/evento-6.jpg",
        category: "música",
        tickets: [
            { type: "GENERAL 11PM", price: 150.00, description: "" },
            { type: "GENERAL ALL DAY", price: 170.00, description: "" },
            { type: "VIP", price: 240.00, description: "" },
            { type: "PALCO ULTRA VIP", price: 340.00, description: "" },
        ],
        whatsappGroupUrl: "https://chat.whatsapp.com/GQFKKNLr5a614OFhy7HKk8"
    },
    {
        id: 7,  
        title: "HALLOWEEN EXÓDO 2025",  
        description: "🎃 Este viernes 31 de octubre, llega una noche épica de Halloween con Exódo, la fiesta temática más esperada del año en Lawn Tennis Club - Jesús María. Con la presencia de Kofla desde Colombia, AnhedoniaDJ, TebaDJ y mucho más. Prepárate para vivir una experiencia única con barra libre, dos escenarios temáticos Halloween, y un show visual inmersivo para una noche terrorífica.",
        date: "31 de octubre, 2025",  
        location: "Lawn Tennis Club - Jesús María",  
        image: "img/eventos/evento-7.jpg",
        category: "música",
        tickets: [
            { type: "GENERAL", price: 50.00, description: "Acceso a zona general con acceso a los escenarios Electrónica y Reggaetón" },
            { type: "VIP", price: 60.00, description: "Acceso a zona VIP y zona general" },
            { type: "DJ BOOTH", price: 90.00, description: "Acceso a zona DJ BOOTH, Experiencia Exódo, zona VIP y zona general" },
            { type: "BOX ZONA URBANA", price: 70.00, description: "Acceso a zona VIP y zona general" },
        ],
        whatsappGroupUrl: "https://chat.whatsapp.com/GQFKKNLr5a614OFhy7HKk8"
    }
];