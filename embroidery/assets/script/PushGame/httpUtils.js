
export class httpUtils{

    constructor(){}

    GetNetJson(url, complete, err) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (response) {
                    response = JSON.parse(response);
                }
                complete(response);
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }
    
    DataDocking(url, param) {
        let xh = new XMLHttpRequest();
        xh.open("POST", url);
        xh.setRequestHeader("Content-Type", "application/json");
        xh.send(param);
    }
}

