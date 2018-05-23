$(document).ready(function() {
    $('#userlist').DataTable( {
        "ajax": 'public/arrays.json'
    } );
} );