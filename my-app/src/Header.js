import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const Header = () => {
    return (
        <div className="App-topbar">
            <center>
                <h1>Pokédex</h1>
                <h6>A React REST API demo using the PokéAPI</h6>
                <a href="https://pokeapi.co/">https://pokeapi.co/</a>
                <h6>Altyn Berd - Dec 2021</h6>
            </center>
        </div>
    )
};

export default Header