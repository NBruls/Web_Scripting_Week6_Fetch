window.addEventListener("load", loaded);

function loaded() {
    createSelect();
    let buttonFetchFriends = document.getElementById("button_get_friends");
    buttonFetchFriends.addEventListener("click", handleGetFriends);
    let buttonPostPerson = document.getElementById("post_person");
    buttonPostPerson.addEventListener("click", handlePostPerson);
}

function createSelect() {
    let url = 'http://localhost:3000/persons/';
    let selectPerson = document.getElementById("select_person");
    let output = document.getElementById("div_output");
    makeElementEmpty(output);
    fetch(url)
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw `error with status ${response.status}`;
            }
        })
        .then((persons) => {
            for (let person of persons) {
                let option = document.createElement("option");
                let name = document.createTextNode(person.name);
                option.value = person.id;
                option.appendChild(name);
                selectPerson.appendChild(option);
            }
        })
        .catch((error) => {
            output.appendChild(document.createTextNode(error));
        });
}

function handleGetFriends() {
    let url = 'http://localhost:3000/persons/';
    let id = document.getElementById("select_person").value;
    let output = document.getElementById("div_output");
    makeElementEmpty(output);
    fetch(`${url}${id}`)
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw `error with status ${response.status}`;
            }
        })
        .then((person) => {
            let friends = person.friends;
            let name = person.name;
            if (friends.length > 0) {
                output.appendChild(document.createTextNode(`${name} heeft vrienden `));
                url += `?id=${friends[0]}`;
                let i = 1;
                while (i < friends.length) {
                    url += `&id=${friends[i]}`;
                    i++;
                }
                    return fetch(url);
            }
        })
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw `error with status ${response.status}`;
            }
        })
        .then((persons) => {
            let names = 0;
            for (let person of persons) {
                let name = person.name;
                if (names == 0) {
                    output.appendChild(document.createTextNode(`${name}`));
                } else {
                    output.appendChild(document.createTextNode(`, ${name}`));
                }
                names++;
            }
        })
        .catch((error) => {
            output.appendChild(document.createTextNode(error));
        });
}

function handlePostPerson() {
    let url = 'http://localhost:3000/persons/';
    let output = document.getElementById("div_output");
    let name = document.getElementById("input_name").value;
    let person = {name: name};
    makeElementEmpty(output);
    fetch(url,
        {
            method: "POST",
            body: JSON.stringify(person),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (response.status == 201) {
                return response.json();
            } else {
                throw `error with status ${response.status}`;
            }
        })
        .then((person) => {
            output.appendChild(document.createTextNode(`${person.id} ${person.name} ${person.friends}`));
        })
        .catch((error) => {
            output.appendChild(document.createTextNode(error));
        });
}

function makeElementEmpty(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}