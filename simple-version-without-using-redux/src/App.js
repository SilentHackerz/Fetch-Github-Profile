import React, { Component } from 'react';
import './App.scss';
// import ReactDOM from 'react-dom';

import Profile from './Profile.js';
import SearchProfile from './SearchProfile.js';

const API = 'https://api.github.com/users';
const APIContribution = 'https://github-contributions-api.now.sh/v1';  // this second API is only for getting the total contributios for the current year.

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: 'getify',
      name:'',
      avatar:'',
      location:'',
      repos:'',
      followers: '',
      following:'',
      homeUrl:'',
      notFound:''
    }

    this.fetchProfile = this.fetchProfile.bind(this);
    this.fetchUserContribution = this.fetchUserContribution.bind(this);
  }

  // How data is being passed from child to parent - https://medium.com/@ruthmpardee/passing-data-between-react-components-103ad82ebd17
  // fetchProfile() is a callback function defined in parent. This takes the data I need as an argument. But the data will come from the child component SearhProfile
  // So, I pass this callback function to the child-Component SearchProfile as a prop, with the below line
  // <SearchProfile fetchProfileBoundFunction={this.fetchProfile.bind(this)}/>
  // Call the callback (fetchProfileBoundFunction) using this.props.[callback] in the child and pass in the data as the argument.
  // So in SearchProfile I do < this.props.fetchProfileBoundFunction(username) >
  fetchProfile(username) {
    let url = `${API}/${username}`;
    fetch(url)
      .then((res) => res.json() )
      .then((data) => {
        this.setState({
          username: data.login,
          name: data.name,
          avatar: data.avatar_url,
          location: data.location,
          repos: data.public_repos,
          followers: data.followers,
          following: data.following,
          homeUrl: data.html_url,
          notFound: data.message,
          lastYearContribution:''
        })
      })
      .catch((error) => console.log('Oops! . There Is A Problem') )
  }

  /* A> Now another function to fetch total contribution from the user.
  B> But Github's above api directly does not give the total contributions number. So used the below one

  C> https://github.com/sallar/github-contributions-api

  D> So, the url for "getify" will be - https://github-contributions-api.now.sh/v1/getify

  E> Now to visualize the data in proper json format - Paste the huge data into  - https://jsonformatter.curiousconcept.com/

  F> I can further paste that into a text-editior, and from there, I can see that the whole json file's first property is "year" which is an array of objects (each object being a year. And for the current (lates) year, I need to access the first object (i.e. the first elemtn of the array). Then within that first object, I have to access the value of the "total" property.
  */
 fetchUserContribution(username) {
  let url = `${APIContribution}/${username}`;

  fetch(url)
    .then((res) => res.json() )
    .then((data) => {
      this.setState({
        lastYearContribution: data.years[0].total
      })
    })
    .catch((error) => console.log('Oops! . There Is A Problem') )
}

  componentDidMount() {
    this.fetchProfile(this.state.username);
    this.fetchUserContribution(this.state.username);
  }
  render() {
    return (
      <div>
         <section id="card">
           <SearchProfile
           fetchProfileBoundFunction={this.fetchProfile.bind(this)}
           fetchProfileContributionBoundFunction={this.fetchUserContribution.bind(this)}
           />
           <Profile data={this.state} />
         </section>

      </div>
    )
  }
}

export default App;

/* Explanation of .bind() in the line <SearchProfile fetchProfileBoundFunction={this.fetchProfile.bind(this)} />  -

THE FIRST 'this'

A) The 'this' in the part this.fetchProfile - makes sure that when fetchProfile() is called in SearchProfile component, the fetchProfile() function refers to the function defined in this main App component
refer to official doc - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind -

B) Generally, if you refer to a method without () after it, such as onClick={this.handleClick}, you should bind that method.

********************
THE SECOND 'this'

Refer to this blog - https://codeburst.io/binding-functions-in-react-b168d2d006cb

C) The 'this' in the part .bind(this) - by official doc of .bind() - the fist argument passed to .bind() is "The value to be passed as the this parameter to the target function when the bound function is called." -

D) So here, by passing 'this' as the first argument I am making sure, when ultimately the boundfunction is called in the child component, the argument passed to that boundFunction is the one thats there in the child component. Because in this case the whole purpose of doing this, is that I want to pass data from child component to the function. And so the 'this' to the boundFunction should refer to the 'this' context of Child component.

Meaning, here in ths case, the SearchProfile component will call the boundFunction and will pass the username data from that child component to this boundFunction.

E) So the final/second ‘this’ is the context we are passing to .bind() and it is referring to the Child's context.

***************************************************
Also refer to my note on .bind() method - ../R/General-Absolute-Stupid-React-Note-On-Structuring-React-App-JSX syntax.odt

Going by the terminology of the .bind() official doc - In the above line >>

A> fetchProfile()is the target function defined in the parent App.component
B> fetchProfileBoundFunction() is the bound function that I am passing as a prop to the child SearchProfile component.
C> And I am calling the fetchProfileBoundFunction() is the bound function in the child SearchProfile component as below
this.props.fetchProfileBoundFunction(username);

***************************************************

So here the overall flow of updating the user profile data with fetchProfile() function is -

A> First initial states are defined in the parent App component.
B> Then parent App component defines the function fetchProfile() to update that initial states.
C> But to update the initial state, I need new data of new users, which I will get from the child SearchProfile component
D> Hence, I pass down this fetchProfile() function from parent to child as a prop.
E> And the most important part is - I make sure that the data I will get to the parent App component, is the value of fetchProfileBoundFunction and which in turn is the result of calling .bind() on fetchProfile(), and passing .bind() the context of ‘this’ which refers to the child SearchProfile component.
  */