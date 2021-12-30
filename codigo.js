class Hamburguesa {
    constructor(nombre, precio, ingredientes, photo) {
        this.name = nombre;
        this.price = precio;
        this.ingredients = ingredientes;
        this.photo = photo
        this.cantidad = 0;
    }
}

const generarHamburguesas = () => {
    let divHamburguesas = $('#hamburguesas').get(0);
    for (const tiposHamburguesa of hamburguesas) {
        let cantidad = localStorage.getItem('carrito.' + tiposHamburguesa.name);
        if (cantidad == undefined) {
            cantidad = 0;
        }

        divHamburguesas.innerHTML += 
            '<div class="col-sm-4">' + 
              '<div class="card">' + 
                '<div class="card-body">' + 
                  '<h5 class="card-title">' + tiposHamburguesa.name + '</h5>' + 
                  '<p class="card-text">' + tiposHamburguesa.ingredients + '</p>' + 
                  '<p class="card-precio">$' + tiposHamburguesa.price + '</p>' + 
                  '<img src="./assets/' + tiposHamburguesa.photo + '" class="fotosHamburguesas" alt="">' +
                  '<div style="display: inline-flex">' + 
                    '<a onClick="agregarHamburguesa(\'' + tiposHamburguesa.name + '\')" class="btn btn-primary">+</a>' + 
                    '<p id="cantidad' + tiposHamburguesa.name + '">' + cantidad + '</p>' +
                    '<a onClick="sacarHamburguesa(\'' + tiposHamburguesa.name + '\')" class="btn btn-primary">-</a>' +  
                  '</div>' + 
                '</div>' + 
              '</div>' + 
            '</div>';
    }
}

const agregarHamburguesa = (nombreHamburguesa) => {
    let hamburguesa = hamburguesas.filter(hamburguesa => hamburguesa.name == nombreHamburguesa)[0];
    // hamburguesa.cantidad += 1;

    let cantidad = localStorage.getItem('carrito.' + nombreHamburguesa);
    if (cantidad == undefined) {
        cantidad = 0;
    }
    cantidad = parseInt(cantidad) + 1;

    localStorage.setItem('carrito.' + nombreHamburguesa, cantidad);

    let divCantidadHamburguesa = $('#cantidad' + nombreHamburguesa).get(0);
    divCantidadHamburguesa.innerHTML = cantidad;

    calcularPrecioPedido();
}

const sacarHamburguesa = (nombreHamburguesa) => {
    let hamburguesa = hamburguesas.filter(hamburguesa => hamburguesa.name == nombreHamburguesa)[0];
    let cantidad = localStorage.getItem('carrito.' + nombreHamburguesa);
    if (cantidad == undefined) {
        cantidad = 0;
    }
    if (cantidad > 0) {
        // hamburguesa.cantidad -= 1;
        cantidad = parseInt(cantidad) - 1;
        localStorage.setItem('carrito.' + nombreHamburguesa, cantidad);
    }

    let divCantidadHamburguesa = $('#cantidad' + nombreHamburguesa).get(0);
    divCantidadHamburguesa.innerHTML = cantidad;

    calcularPrecioPedido();
}

const calcularPrecioPedido = () => {
    let precioFinal = 0;
    let divCarrito = $('#carrito').get(0);
    divCarrito.innerHTML = '';
    for (const hamburguesa of hamburguesas) {
        let cantidad = localStorage.getItem('carrito.' + hamburguesa.name);
        if (cantidad == undefined) {
            cantidad = 0;
        } else {
            let rowCarrito = "<div class='rowCarrito rowCarrito"  + hamburguesa.name + "'>" + hamburguesa.name + " x" + cantidad + "   ----------------   $" + (hamburguesa.price * cantidad) + '<br>';
            divCarrito.innerHTML += rowCarrito;        
        }
        precioFinal += hamburguesa.price * cantidad;
    }
    
    let divPrecioFinal = $('#precioFinal').get(0);
    divPrecioFinal.innerHTML = "$" + precioFinal;
    return precioFinal;
}

const verHamburguesas = () => {
    let texto = "";
    for (const tiposHamburguesa of hamburguesas) { 
        texto += `Nombre: ${tiposHamburguesa.name}\n Precio: $${tiposHamburguesa.price}\n Ingredientes: ${tiposHamburguesa.ingredients} \n\n`
    }
    return texto;
}


const hamburguesas = [];

$(document).ready(function() {

    // hamburguesas.push (new Hamburguesa("ROYALE", 500, "Doble medallon de carne, doble cheddar y salsa Detroit", "royale.jpeg"));
    // hamburguesas.push (new Hamburguesa("PETIT", 600, "Doble medallon de carne, doble cheddar, panceta y huevo frito", "petit.jpeg"));
    // hamburguesas.push (new Hamburguesa("NOSTRA", 650, "Doble carne, panceta, roquefort y cebolla caramelizada", "nostra.jpeg"));

    $.getJSON("hamburguesas.json", function(respuesta, estado) {
        if (estado == 'success') {
            for(const hambur of respuesta) {
                hamburguesas.push(new Hamburguesa(hambur.name, hambur.price, hambur.ingredients, hambur.photo));
            }
        }
        generarHamburguesas();
        calcularPrecioPedido();
    });

    $('#finalizarPedido').click(function(event) {
        let divFinalizarPedidoText = $('#finalizarPedidoText').get(0);
        let precio = calcularPrecioPedido();
        if (precio != 0) {
            $.getJSON("pedidoPost.json", function(respuesta, estado) {
                if (estado == 'success') {
                    $('#finalizarPedidoText').hide();
                    divFinalizarPedidoText.innerHTML = respuesta;
                    event.target.style.display = "none";
                    localStorage.clear();
                    $('#finalizarPedidoText').fadeIn( 3000, function() {
                    });
                }
            });
        } else {
            divFinalizarPedidoText.innerHTML = `Tu pedido no puede estar vacío`;
            divFinalizarPedidoText.animate({
                opacity: 0,
                fontSize: "1.2em",
              }, 3000, function() {
            })
        }
        
    });

});