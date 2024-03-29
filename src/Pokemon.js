import React from 'react';
import {Component} from 'react';
import Header from './Header'
import PokeCard from './PokeCard'
import 'bootstrap/dist/css/bootstrap.min.css'

class Pokemon extends Component {
  constructor() {
    super();
    this.state = {
      pokemons : [],
      pokemonDetails : [],
      offset: 0,
      loadNumber: 24      
    }
    this.handleMoreClick = this.handleMoreClick.bind(this);
  }

  getNextOffset() {
    return this.state.offset+this.state.loadNumber;
  }

  handleMoreClick(event) {
    const newOffset = this.getNextOffset();
    this.setState({offset: newOffset}, () => {
      console.log("Offset: " + this.state.offset)
      this.getMorePokemon();
    });
    
  }
  
  componentDidMount() {
    this.getMorePokemon();
  }

  getMorePokemon() {
    let url = "https://pokeapi.co/api/v2/pokemon?offset=" + this.state.offset + "&limit=" + this.state.loadNumber;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data) {
        this.setState({pokemons : data.results})

        this.state.pokemons.map(pokemon => {
          fetch(pokemon.url)
          .then(response => response.json())
          .then(data => {
            if (data) {
              var temp = this.state.pokemonDetails
              temp.push(data)
              this.setState({pokemonDetails: temp})
            }            
          })
          .catch(console.log)
        })
      }
    })
    .catch(console.log)
  }

  render() {
    const {pokemonDetails} = this.state;

    const renderedPokemonList = pokemonDetails.map((pokemon, index) => {
      return (<PokeCard pokemon={pokemon} />);
    });

    return (
      <div>
        <Header />
        <div className="container mt-3 pb-3 d-flex flex-column justify-content-center">
          <div className="card-deck d-flex flex-wrap m-1">
            {renderedPokemonList}
          </div>
          <div type="button" className="btn btn-warning d-md-block mx-auto" key="more-button" id="more-button" onClick={this.handleMoreClick}>Load More</div>
        </div>
        
      </div>
    );
  }
}

export default Pokemon;