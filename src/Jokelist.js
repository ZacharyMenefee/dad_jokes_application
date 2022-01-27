import axios from "axios";
import React, { Component } from 'react';
const API_URL = "https://icanhazdadjoke.com/"

class Jokelist extends Component{
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
            jokes.push(res.data.joke);
        }
        this.setState({
            jokes: jokes,
        })
    };

    render(){
        return(
            <div className="Jokelist"> 
                  <h1>Dad Jokes</h1>
                  <div className="Jokelist-jokes">
                    {this.state.jokes.map(joke => (
                        <div>{joke}</div>
                    ))}
                  </div>  
            </div>
        )
    };
}

export default Jokelist;