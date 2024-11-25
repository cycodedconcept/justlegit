function getSuccessMessage() {
    const params = new URLSearchParams(window.location.search);
    const invoiceid = params.get('reference');

    const suMethod = {
        method: 'GET'
    }

    const url = `https://legithairng.com/backend/admin/verify_invoice_payment?invoiceid=${invoiceid}`;

    fetch(url, suMethod)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.message === 'success') {
            Swal.fire({
                icon: 'success',
                text: `${result.message}`,
                confirmButtonColor: '#FF962E'
            })
        }
        else {
            Swal.fire({
                icon: 'error',
                text: `${result.message}`,
                confirmButtonColor: '#FF962E'
            })  
        }
    })
    .catch(error => console.log('error', error));
}