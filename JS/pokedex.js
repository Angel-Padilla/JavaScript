/*  Global variables */
pokeApiURL = "https://pokeapi.co/api/v2/";
pokemonTipos = "";
numeroTipos = "";
botones = "";
/*FUNCIONES*/

function getEventListeners(){
    upB = document.getElementById("upButton");
    downB = document.getElementById("downButton");
    leftB = document.getElementById("leftButton");
    rightB = document.getElementById("rightButton");
    searchB = document.getElementById("searchButton");
    typeB = document.getElementById("typeButton");
    okB = document.getElementById("okButton");
    modeB = document.getElementById("displayMode");
    backgroundB = document.getElementById("backgroundChange");
    viewB = document.getElementById("viewButton");

    upB.addEventListener("click", buttonUp);
}

function buttonUp(){
    console.log("Arriba");
}

async function fetchTypes(){
    const url = `${pokeApiURL}type`;
    fetch(url).then((res) => {
        console.log(res);
        if(res.status == "200"){
            return res.json();
        }
    }).then((data) =>{
        if(data){
            pokemonTipos = data.results;
            numeroTipos = data.count;

            /*pone los nombres de los tipos en español*/

            for(let i = 0; i < numeroTipos; i++){
                let j = i+1;
                if(i == 18){
                    j = 10001;
                }
                if(i == 19){
                    j= 10002;
                }
                fetch(`${url}/${j}`).then((res)=>{
                    if(res.status == "200"){
                        return res.json();}
                }).then((data)=>{
                    if(data){
                        pokemonTipos[i].name = data.names[5].name;
                    }
                });
            }
            console.log(pokemonTipos);

        }
    });
}
async function showTypes(){
    done = false;
    done = await fetchTypes();
    console.log(pokemonTipos);
}

showTypes();
getEventListeners();