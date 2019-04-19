<?php 
include 'inc/funciones/funciones.php';
include 'inc/layout/header.php'; 


$id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

if(!$id){
    die('No es valido');
}

$resultado = obtenerContacto($id);
$contacto = $resultado->fetch_assoc();


?>

<div class="contenedor-barra">
    <div class="contenedor barra">
        <a href="index.php" class="btn volver">Volver</a>
        <h1>Agendas de contactos</h1>
    </div>
</div>

<div class="bg-amarillo contenedor sombra">
    <form action="#" id="contacto">
    <legend>Edite el contacto <span>Todos los campos son obligatorios</span></legend>
    <?php include 'inc/layout/formulario.php'; ?>
    </form>
</div>


<?php include 'inc/layout/footer.php'; ?>