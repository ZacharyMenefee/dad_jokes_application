import axios from "axios";
import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Jokelist.css'
import Joke from './Joke.js'
const API_URL = "https://icanhazdadjoke.com/"

class JokeList extends Component{
    constructor(props){
        super(props)

        this.state = {
            jokes: [],
        };

        this.handleVote = this.handleVote.bind(this);
    };

    static defaultProps = {
        numberJokestoGet: 10,
    };

    handleVote(id, delta){
        this.setState(
            st => ({
                jokes: st.jokes.map(j => 
                    j.id === id ? {...j, votes: j.votes + delta} : j)
            })
        )
    }

    async componentDidMount(){
        let jokes = [];
        while(jokes.length < this.props.numberJokestoGet){
            let res = await axios.get(API_URL, {
                headers: {
                    Accept: "application/json",
                }
            });
            jokes.push({id: uuidv4(), text: res.data.joke, votes: 0});
        }
        this.setState({
            jokes: jokes,
        })
    };

    render(){
        return(
            <div className="JokeList">
            <div className="JokeList-sidebar">
                <h1 className="JokeList-title"><span>Dad</span> Jokes</h1>
                <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"></img>
                <button className="JokeList-getmore">New Jokes</button>
            </div> 
                  <div className="JokeList-jokes">
                    {this.state.jokes.map(j => (
                            <Joke key={j.id} 
                            votes={j.votes} 
                            text={j.text} 
                            upVote={() => this.handleVote(j.id, 1)}
                            downVote={() => this.handleVote(j.id, -1)}
                            />
                    ))}
                  </div>  
            </div>
        )
    };
}

export default JokeList;