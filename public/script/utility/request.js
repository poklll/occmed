function createFormData(data) {
    var formData = new FormData();
    data.map( item => {
        formData.append( item.name , item.data);
    });
    return formData;
}

function request(method, path, data) {
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, path);
        xhr.onload = function () {
            var res = JSON.parse(xhr.responseText);
            resolve(res);
        }
        xhr.send(data);
    })
}
