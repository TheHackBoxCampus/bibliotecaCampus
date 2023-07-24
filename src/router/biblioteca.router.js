import {Router} from "express";
import dotevn from "dotenv"; 
import conx from "../services/database.js";
import mdAutorEspecifico from "../middleware/autor.especifico.js";
import mdNovelaEspecifico from "../middleware/novela.especifica.js";
import mdLibroEspecifico from "../middleware/prestado.especifico.js";
import mdEditorial from "../middleware/editorial.js";
import jwtValidate from "../middleware/auth.js";
import { SignJWT } from "jose";

dotevn.config(); 

const router = Router(); 

router.get("/autenticacion", async (req, res) => {
    let encoder = new TextEncoder();
    let jwtC = new SignJWT({id: 1});
    let jwt = await jwtC
    .setProtectedHeader({alg: "HS256", typ: "JWT"})
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(encoder.encode(process.env.KEY));
    res.cookie("auth", jwt)
    res.send({status: 200, message: "token generado"})
})


router.get("/nacionalidad_autor", jwtValidate, (req, res) => {
    let searchPerson = /* sql */`
    SELECT a.nombre as autor,
           a.nacionalidad as nacionalidad
    FROM libro as l
    LEFT JOIN autor as a ON a.id_autor = l.id_autor
    `;

    conx.query(searchPerson, jwtValidate, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});


router.get("/categorias", jwtValidate, (req, res) => {
    let searchCategories = /* sql */`
    SELECT * FROM categoria
    `;

    conx.query(searchCategories, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});


router.get("/editoriales", jwtValidate, (req, res) => {
    let searchMark = /* sql */`
    SELECT e.nombre as editorial, 
           e.direccion as direccion 
    FROM editorial as e; 
    `;

    conx.query(searchMark, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});


router.get("/estado_libros", jwtValidate, (req, res) => {
    let searchState = /* sql */`
    SELECT es.nombre as estado,
           es.descripcion as descripcion
    FROM libro as l 
    LEFT JOIN estado_libro as es ON es.id_estado = l.id_estado 
    `;

    conx.query(searchState, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});



router.get("/libros", jwtValidate, (req, res) => {
    let searchBook = /* sql */`
    SELECT l.titulo as titulo,
		a.nombre as autor,
        e.nombre as editorial 
    FROM libro as l 
    LEFT JOIN autor as a ON l.id_autor = a.id_autor
    LEFT JOIN editorial as e ON e.id_editorial = l.id_editorial
    `;

    conx.query(searchBook, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});


router.get("/prestamos", jwtValidate, (req, res) => {
    let searchLoan= /* sql */`
    SELECT p.fecha_prestamo as fecha_prestamo,
	   p.fecha_devolucion as fecha_devolcion,
       p.estado as estado 
    FROM prestamo as p;
    `;

    conx.query(searchLoan, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});


router.get("/reservas", jwtValidate, (req, res) => {
    let searchBooking= /* sql */`
    SELECT r.fecha_reserva as fecha_reserva,
    r.estado as estado 
    FROM reserva as r; 
    `;

    conx.query(searchBooking, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});

router.get("/libros_disponibles", jwtValidate, (req, res) => {
    let searchBookAvailable = /* sql */`
    SELECT l.titulo as titulo ,
	   a.nombre as autor,
	   est.nombre as estado
    FROM libro as l
    LEFT JOIN autor as a ON a.id_autor = l.id_autor 
    LEFT JOIN estado_libro as est ON l.id_estado = est.id_estado 
    WHERE est.nombre = "Disponible" 
    `;

    conx.query(searchBookAvailable, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});



router.get("/libros_prestados", jwtValidate, (req, res) => {
    let searchBookNoAvailable = /* sql */`
    SELECT l.titulo as libro,
           p.estado as estado,
           p.fecha_devolucion as fecha_devolucion
    FROM prestamo as p
    LEFT JOIN libro as l ON p.id_libro = p.id_libro
    WHERE p.estado = "Prestado"
    `;

    conx.query(searchBookNoAvailable, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});


router.get("/usuarios", jwtValidate, (req, res) => {
    let searchUser = /* sql */`
    SELECT u.nombre as usuario,
         u.email as correo_electronico 
    FROM usuario as u;
    `;

    conx.query(searchUser, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});


router.post("/autor/:nombre", 
jwtValidate,
mdAutorEspecifico,
(req, res) => {
    let searchBooksForOwn = /* sql */`
    SELECT l.titulo as libro,
	       a.nombre as autor
    FROM libro as l 
    LEFT JOIN autor as a ON a.id_autor = l.id_autor
    WHERE a.nombre = ?
    `;
    conx.query(
        searchBooksForOwn, 
        [req.params.usr],
       (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});


router.post("/categoria/:tipo", 
jwtValidate,
mdNovelaEspecifico,
(req, res) => {
    let searchCategorieSpecific = /* sql */`
    SELECT l.titulo as libro,
	   c.nombre as categoria
    FROM libro as l 
    LEFT JOIN categoria as c ON c.id_categoria = l.id_categoria
    WHERE c.nombre = ?
    `;
    conx.query(
        searchCategorieSpecific, 
        [req.params.tp],
       (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});


router.get("/libros_paginas", jwtValidate, (req, res) => {
    let searchBooks = /* sql */`
    SELECT l.titulo as libro,
	   a.nombre as autor,
	   l.num_paginas as numero_pagina
    FROM libro as l
    LEFT JOIN autor as a ON a.id_autor = l.id_autor
    WHERE l.num_paginas > 500
    `;

    conx.query(searchBooks, (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});

router.post("/prestados/:persona", 
jwtValidate,
mdLibroEspecifico,
(req, res) => {
    let searchBookLoan = /* sql */`
    SELECT u.nombre as usuario,
           l.titulo as libro,
           r.estado as estado
    FROM reserva as r 
    LEFT JOIN usuario as u ON u.id_usuario = r.id_usuario
    LEFT JOIN libro as l ON l.id_libro = r.id_libro 
    WHERE u.nombre = ?
    `;
    conx.query(
        searchBookLoan, 
        [req.params.per],
       (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});

router.post("/editorial/:editorial", 
jwtValidate,
mdEditorial,
(req, res) => {
    let searchBookLoan = /* sql */`
    SELECT l.titulo as libro,
          e.nombre as editorial
    FROM libro as l 
    LEFT JOIN editorial as e ON e.id_editorial = l.id_editorial
    WHERE e.nombre = ?
    `;
    conx.query(
        searchBookLoan, 
        [req.params.ed],
       (err, results) => {
        err 
            ? res.send(err)
            : res.status(200).send(results)
    })
});



export default router; 
