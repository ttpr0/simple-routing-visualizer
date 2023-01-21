async function openDirectory()
{
    var url = "http://localhost:5052/open";
    var response = await fetch(url, {
        method: 'GET', 
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer',  
      });
    var json = await response.json();
    //console.log(json);
    return json;
}

async function getTree(path)
{
    var url = "http://localhost:5052/get_tree";
    var response = await fetch(url, {
        method: 'POST', 
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify({
            "path": path
        }) 
      });
    return await response.json()
}

async function closeDirectory(key)
{
    var url = "http://localhost:5052/close";
    var response = await fetch(url, {
        method: 'POST', 
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify({
            "key": key
        }) 
    });
}

async function openLayer(path)
{
    var url = "http://localhost:5052/open_layer";
    var response = await fetch(url, {
        method: 'POST', 
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow', 
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify({
            "path": path
        }) 
      });
    return await response.json()
}

export { openDirectory, openLayer, getTree, closeDirectory }