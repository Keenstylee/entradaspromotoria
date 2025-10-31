/**
 * Base de datos de testimonios
 * 
 * Para agregar un nuevo testimonio, agrega un objeto con:
 * - id: identificador único
 * - name: nombre del cliente
 * - username: handle o usuario
 * - avatar: URL de la imagen de perfil (usando avatares genéricos)
 * - comment: testimonio del cliente
 */

export const testimonials = [
    {
        id: 1,
        name: "Ana López",
        username: "@analopez",
        avatar: "https://ui-avatars.com/api/?name=Ana+López&background=random&color=fff",  // Avatar genérico
        comment: "¡El mejor! Siempre confío en Keen para mis entradas. Aunque a veces hay que esperar un poco, siempre encuentro boletos a un precio mucho más bajo que en otras webs ¡Lo recontra recomiendo!"
    },
    {
        id: 2,
        name: "Carlos García",
        username: "@carlosgarcia",
        avatar: "https://ui-avatars.com/api/?name=Carlos+García&background=random&color=fff",  // Avatar genérico
        comment: "Keen nunca me ha fallado. Aunque a veces tarde un poco x2, siempre consigo entradas más baratas que en cualquier otra página, totalmente confiable y recomendado"
    },
    {
        id: 3,
        name: "María Rodríguez",
        username: "@mariardgz",
        avatar: "https://ui-avatars.com/api/?name=María+Rodríguez&background=random&color=fff",  // Avatar genérico
        comment: "Siempre que busco entradas para eventos, recurro al admin. Siempre tiene lo mejor de los eventos disponibles y a un precio excelente. No hay comparación con mi king!"
    }
];
