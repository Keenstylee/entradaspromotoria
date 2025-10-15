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
 */

export const events = [
    {
        id: 1,
        title: "Concierto de Rock en Vivo",
        date: "15 de Julio, 2024",
        location: "Estadio Central",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-Xxq6xgMjJK2_WxaL5m4v2Qv8vMx0zsCljyv4X1rnyWA4ggNJItBwrVG5AS3F3dG1Zv-yZCjk0hkde_w6lTSYCidxHyzr3JWIAjy3Iiq8gb414so6liDQjuIKB_f1Vdv0r3eb7dDcaJ0OXvve5AbUTaKo-YVS7TqA2S-b_iyIPTs7YiVk7VukHcSiK0QGkJeAodfV_-ilqYdkjWs9yr7NaPBTRsjyW-se4eX1CQn-M1pKLJX3mXcDpyAkMznraYGa-2JgbuoK4rc",
        category: "música",
        tickets: [
            { type: "General", price: 50.00, description: "Acceso al evento." },
            { type: "VIP", price: 120.00, description: "Acceso preferencial y merchandising." },
            { type: "SuperVIP", price: 250.00, description: "Meet & Greet con los artistas." }
        ]
    },
    {
        id: 2,
        title: "Festival de Jazz Urbano",
        date: "22 de Agosto, 2024",
        location: "Parque del Lago",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAYg8BedqpvRHCJt3OryHluAsQzTwaR2gUrpxkN92MHAA_gsHH7ui4KjNhffc6ZLQwmW_g3q9aGuXPVVsYsEZennZeaf-tph_DiQtHk-Z3tMSlj80OjACLS7i5vHW4wsV_79MdP1GHAyPo8i99YfIkoI73tr2b6tASK4pV6qXx1nAQiD01Lewszxte8qeFf9xKOYdq_U2xNH7qu2Aposay1KbGWGHN-TJSNLPFl23HGTAXs5DvDX16F-WgesBIRn38OcLK5oXa0JY",
        category: "música",
        tickets: [
            { type: "General", price: 40.00, description: "Acceso al evento." },
            { type: "VIP", price: 100.00, description: "Acceso preferencial y zona exclusiva." }
        ]
    },
    {
        id: 3,
        title: "Noche de Comedia con Estrellas",
        date: "5 de Septiembre, 2024",
        location: "Teatro Metropolitano",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAVEf5wxDYt-pAm5n6-C-_39_cJApF8cESmqg7bDVJOrhJiRCZMxtFxd05-17HQGv-U4fvq4xFloORge_B3pR7A0mEJNRC0i2neHTypBBo1eSxqP8X1GdlrMnNVOeaYk3O7oN45xTYkvtKyl6-WAQTk-h0Ad9rivAR36lAJvxP3OATVjKG1CMWBR3sVDrs6X0QdJHTwE2_QJhoaO1oP8FD7LcIwvLWrw69WR4hYXxodPrgUWbfnR0td_hn5NV-2d1q9PwtfnR3kbM",
        category: "comedia",
        tickets: [
            { type: "General", price: 30.00, description: "Asiento general." },
            { type: "VIP", price: 75.00, description: "Asiento preferencial y bebida de cortesía." }
        ]
    },
    {
        id: 4,
        title: "Exposición de Arte Contemporáneo",
        date: "12 de Octubre, 2024",
        location: "Galería de Arte Moderno",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmTzcI_ElZuOahzb1wbZTP14CwYEgDBPKpuRf2nETlzNH5mG9xA2aDQp1W8zJRxVJXT713HEsQuFwRbmF0rHD2at063J6Md481CuRts1jQAWNsb-YcX9w7Vgz1Gi4QEueWTMnt_kl2MPhx2MXh18uVBGXi8GPHEs9vttENF9KqBKLomByi3HnarfAkLLwgCWmETQhmKpXHPxKnLboTKKwr2fLVIrUAQZ3aDrNIXAAs3HjEjM1cFvQYMterKAnI_5AH4f8xyxkK4ws",
        category: "arte",
        tickets: [
            { type: "Entrada General", price: 20.00, description: "Acceso a todas las exhibiciones." },
            { type: "Visita Guiada", price: 35.00, description: "Acceso y tour guiado." }
        ]
    }
];