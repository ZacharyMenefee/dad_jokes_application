import axios from "axios";
import React, { Component } from 'react';
import './Jokelist.css'
const API_URL = "https://icanhazdadjoke.com/"

class JokeList extends Component{
    constructor(props){
        super(props)

        this.state = {
            jokes: [],
        };
    };

    static defaultProps = {
        numberJokestoGet: 10,
    };

    async componentDidMount(){
        let jokes = [];
        while(jokes.length < this.props.numberJokestoGet){
            let res = await axios.get(API_URL, {
                headers: {
                    Accept: "application/json",
                }
            });
            jokes.push({joke: res.data.joke, votes: 0});
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
                        <div>
                        {j.joke} - {j.votes}
                        </div>
                    ))}
                  </div>  
            </div>
        )
    };
}

export default JokeList;