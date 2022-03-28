/*  Global variables */
pokeApiURL = "https://pokeapi.co/api/v2/";
pokemonTipos = "";
numeroTipos = "";
botones = "";
AuxArray = [];
showing = "";
position = 0;
darkMode = false;
view = "front_default";

/*FUNCIONES*/
function getElements(){
    // BOTONES
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
    // SECCIONES
    pageBody = document.getElementById("pageBody");
    //DIVS
    pokedexZone = document.getElementById("pokedexZone");
    description = document.getElementById("description-box");
    statBox = document.getElementById("stats");
    //IMGS
    display = document.getElementById("pokedex-display");
    imageOnDisplay = document.getElementById("display-image");
    //SPAN
    healthV = document.getElementById("healthV");
    attackV = document.getElementById("attackV");
    defenseV = document.getElementById("defenseV");
    speedV = document.getElementById("speedV");
    //TEXT
    type1 = document.getElementById("pokeType1");
    type2 = document.getElementById("pokeType2");
    //INPUT
    pokeName = document.getElementById("pokeName");

}
function addEventListeners(){

    upB.addEventListener("click", next);
    downB.addEventListener("click", back);
    leftB.addEventListener("click", back);
    rightB.addEventListener("click", next);
    searchB.addEventListener("click", search);
    typeB.addEventListener("click", pokemonTypes);
    okB.addEventListener("click", ok);
    modeB.addEventListener("click", changeMode);
    backgroundB.addEventListener("click", changeBackground);
    viewB.addEventListener("click", changeView);

    window.addEventListener("resize", adjustPokedex);
}

function adjustPokedex(){
    if(pokedexZone.clientHeight <= 0.9*pageBody.clientHeight){
        pokedexZone.style.width = "80%";
    }
    else{
        const porcentaje = 1.25*pageBody.clientHeight*100/pageBody.clientWidth;
        pokedexZone.style.width = `${porcentaje}%`;
    }
    let pixels = description.clientWidth/12;
    description.style.fontSize = `${pixels}px`;
    pixels = statBox.clientWidth/15;
    healthV.style.fontSize = `${pixels}px`;
    attackV.style.fontSize = `${pixels}px`;
    defenseV.style.fontSize = `${pixels}px`;
    speedV.style.fontSize = `${pixels}px`;
    pixels = type1.clientWidth/9;
    type1.style.fontSize = `${pixels}px`;
    type2.style.fontSize = `${pixels}px`;
    pixels = pokeName.clientWidth/9;
    pokeName.placeholder.style.fontSize = `${pixels}px`;
    pokeName.style.fontSize = `${pixels}px`;
}

function init(){
    getElements();
    addEventListeners();
    adjustPokedex();
}

function next(){
    if(position < AuxArray.length-1){
        position +=1;
        updateGUI();
    }
    else if(position == AuxArray.length-1){
        position = 0;
        updateGUI();
    }
}
function back(){
    if(position > 0){
        position -=1;
        updateGUI();
    }
    else if(position == 0){
        position = AuxArray.length-1;
        updateGUI();
    }
}
async function pokemonTypes(){
    await fetchTypes();
    AuxArray = pokemonTipos;
    showing = "types";
    position = 0;
    updateGUI();
}
function search(){

}
async function ok(){
    if(showing == "types"){
        const res = await fetch(AuxArray[position].url);
        if(res.status == "200"){
            const data = await res.json();
            if(data){
                showing = "pokemon-from-types";
                AuxArray = data.pokemon;
                for (let i = 0; i < AuxArray.length; i++){
                    AuxArray[i] = AuxArray[i].pokemon;
                }
                position = 0;
                updateGUI();
            }
        }
    }
}
function changeMode(){
    if(!darkMode){
        display.style.backgroundColor = "rgb(31,31,30)";
        darkMode = true;
    }
    else{
        display.style.backgroundColor = "#e8e8e8";
        darkMode = false;
    }
    
}
function changeBackground(){
    const randNumber = Math.floor(Math.random()*6 + 1);
    const src = `../imgs/background/fondo_${randNumber}.jpg`;
    pageBody.style.backgroundImage = `url(${src})`;
}
function changeView(){

    if(view == "front_default"){
        view = "back_default";
    }
    else{
        view = "front_default";
    }
    updateGUI();
}
async function fetchTypes(){
    const url = `${pokeApiURL}type`;
    /*USO DE AWAIT */
    const response = await fetch(url);
    if(response.status == "200"){
        const data = await response.json();
        if(data){
            pokemonTipos = data.results;
            pokemonTipos.length = 18;
            numeroTipos = pokemonTipos.length; 
        }
    }
    /*pone los nombres de los tipos en español*/
    for(let i = 0; i < numeroTipos; i++){
        let j = i+1;
        const response = await fetch(`${url}/${j}`);
        if(response.status == "200"){
            const data = await response.json();
            if(data){
                pokemonTipos[i].name = data.names[5].name;
            }
        }
    }
}
async function updateGUI(){
    switch(showing){
        case "types":
            const nombre = AuxArray[position].name;
            var src = `../imgs/pokemon_type_logo/${nombre}.png`;
            displayImg(src);
            displayStats();
            break;
        case "pokemon":
            break;
        case "pokemon-from-types":
            src = "";
            const res = await fetch(AuxArray[position].url);
            if(res.status == "200"){
                const data = await res.json();
                if(data){
                    src = data.sprites[`${view}`];
                    displayImg(src);
                }
            }
            displayStats();
            break;
        default:
            break;
    }
}

function displayImg(src){
    imageOnDisplay.src = src;
}
async function displayStats(){
    if(showing == "types"){
        earaseStats();
        const name=AuxArray[position].name;
        pokeName.placeholder = `${name}`;
    }else{
        const res = await fetch(AuxArray[position].url);
        if(res.status == "200"){
            const data = await res.json();
            if(data){
                const name = data.species.name;
                pokeName.placeholder = `${name}`;
                const stat = data.stats;
                healthV.innerHTML = stat[0].base_stat;
                attackV.innerHTML = stat[1].base_stat;
                defenseV.innerHTML = stat[2].base_stat;
                speedV.innerHTML = stat[5].base_stat;
                const abilityURL = data.abilities[0].ability.url;

                const response = await fetch(abilityURL);
                if(response.status = "200"){
                    const ability = await response.json();
                    if(ability){
                        const text = ability.flavor_text_entries[13].flavor_text;
                        console.log(text);
                        description.innerHTML = `${text}`;
                    }
                }
            }
        }
    }
}
function earaseStats(){
    healthV.innerHTML = "";
    attackV.innerHTML = "";
    defenseV.innerHTML = "";
    speedV.innerHTML = "";
    description.innerHTML = "";
}
function displayINFO(baseURL){

}

init();