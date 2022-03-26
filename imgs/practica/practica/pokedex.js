const pokehp=document.getElementById("pokehp")
const poke_ID=document.getElementById("pokeID")
const fetchPokemon = () => {
    const pokeNameInput = document.getElementById("pokeName");
    const pokeImgInput = document.getElementById("pokeImg");
    const fondo = document.getElementById("fondo");

    let pokeName = pokeNameInput.value; 
    pokeName = pokeName.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
    fetch(url).then((res) => {
        if (res.status != "200") {
            console.log(res);
            pokeImage("./assets/pikasad.gif")
            pokeImgInput.style.top="230px";
            pokeImgInput.style.left="135px";
        }
        else {
            return res.json();
        }
    }).then((data) => {
        if (data) {
            console.log(data);
            const {stats, types} =data;
            let pokeability = data.abilities[0].ability.url;
            let pokeImg = data.sprites.front_default;
            let hp= data.stats[0].stat.name;
            console.log(hp);    
            pokeID.textContent=`Nº ${data.id}`
            pokeImage(pokeImg);
            console.log(pokeImg);
            pokespecie(types);
            fetchability(pokeability);
            pokestadistics(stats);
            const colorOne = typeColors[types[0].type.name];
            const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default;
            fondo.style.background =  `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`;
            fondo.style.backgroundSize = ' 5px 5px';
        }
    });
}
const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    default: '#2A1A1F',
};


const pokeImage = (url) => {
    const pokePhoto = document.getElementById("pokeImg");
    pokePhoto.src = url;
}
const pokespecie = types => {
    const pokeType = document.getElementById("poketype");
    pokeType.innerHTML='';
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.textContent = type.type.name;
        pokeType.appendChild(typeTextElement);
    });
}
const fetchability = (url) =>{
    const pokehabilidad = document.getElementById("pokehab");
    fetch(url).then((res) => {
            return res.json();
    }).then((data) => {
        if (data) {
            let habilidad= data.flavor_text_entries[13].flavor_text;
            pokehabilidad.textContent= `Este pokemon ${habilidad.toLowerCase()}`
        }
    });
}

const pokestadistics = stats => {
    console.log(stats);
    const pokeStats = document.getElementById("pokeStats");
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement("ul");
        const statElementName = document.createElement("il");
        const statElementAmount = document.createElement("il");
        statElementName.classList.add(`name`);
        statElementAmount.classList.add("amount");
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement);
    });
}

