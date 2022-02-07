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
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false,
        };

        this.seenJokes = new Set(this.state.jokes.map(j => j.text));
        this.handleVote = this.handleVote.bind(this);
        this.handleClick = this.handleClick.bind(this);
    };

    static defaultProps = {
        numberJokestoGet: 10,
    };

    handleVote(id, delta){
        this.setState(
            st => ({
                jokes: st.jokes.map(j => 
                    j.id === id ? {...j, votes: j.votes + delta} : j
                    )
            }),
            () => 
                window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    }

    handleClick(){
        this.setState({loading: true}, this.getJokes);
    }

    componentDidMount(){
        if(this.state.jokes.length === 0) this.getJokes();
    }
    
    async getJokes(){
        try{
            let jokes = [];
            while(jokes.length < this.props.numberJokestoGet){
                let res = await axios.get(API_URL, {
                    headers: {
                        Accept: "application/json",
                    }
                });
                let newJoke = res.data.joke;
                if(!this.seenJokes.has(newJoke)){
                    jokes.push({id: uuidv4(), text: res.data.joke, votes: 0});
                } else {
                    console.log("Found a duplicate!")
                }
            }
            this.setState( st => ({
                loading: false,
                jokes: [...st.jokes, ...jokes],
            }), () => 
            window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
            );    
        } catch(e) {
            alert(e);
            this.setState({loading: false});
        }
    };

    render(){
        if(this.state.loading){
            return(
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin"/>
                    <h1 className="JokeList-title">loading...</h1>
                </div>
            )
        }
        let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes)
        return(
            <div className="JokeList">
            <div className="JokeList-sidebar">
                <h1 className="JokeList-title"><span>Dad</span> Jokes</h1>
                <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" alt="Emoji Laughing"></img>
                <button className="JokeList-getmore" onClick={this.handleClick}>Fetch Jokes</button>
            </div> 
                  <div className="JokeList-jokes">
                    {jokes.map(j => (
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