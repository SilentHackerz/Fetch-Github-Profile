import React, { Component } from 'react';
import './App.scss';
import ReactDOM from 'react-dom';

const API = 'https://api.github.com/users';
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: 'rohan-paul',
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
  }
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
          notFound: data.message
        })
      })
      .catch((error) => console.log('Oops! . There Is A Problem') )
  }
  componentDidMount() {
    this.fetchProfile(this.state.username);
  }
  render() {
    return (
      <div>
         <section id="card">
           <SearchProfile fetchProfileBoundFunction={this.fetchProfile.bind(this)}/>
           <Profile data={this.state} />
         </section>

      </div>
    )
  }
}


class SearchProfile extends React.Component {
  render() {
    return (
      <div className="search--box">
         <form onSubmit={this.handleForm.bind(this)}>
           <label><input onChange={(e) => this.handleForm(e)} type="search" ref="username" placeholder="Type Username + Enter"/></label>
         </form>
      </div>
    )
  }

  handleForm(e) {
   e.preventDefault();
    let username = e.target.value;
    this.props.fetchProfileBoundFunction(username);
    e.target.value = '';
  }
}

class Profile extends React.Component {
  render() {
    let data = this.props.data;
    let followers = `${data.homeUrl}/followers`;
    let repositories = `${data.homeUrl}?tab=repositories`;
    let following = `${data.homeUrl}/following`;
    if (data.notFound === 'Not Found')
      return (
         <div className="notfound">
            <h2>Oops !!!</h2>
            <p>The Component Couldn't Find The You Were Looking For . Try Again </p>
         </div>
      );
      else
      return (
        <section className="github--profile">
          <div className="github--profile__info">
            <a href={data.homeUrl} target="_blank" title={data.name || data.username}><img src={data.avatar} alt={data.username}/></a>
            <h2><a href={data.homeUrl} title={data.username} target="_blank">{data.name || data.username}</a></h2>
            <h3>{data.location || 'I Live In My Mind'}</h3>
          </div>
          <div className="github--profile__state">
            <ul>
               <li>
                  <a href={followers} target="_blank" title="Number Of Followers"><i>{data.followers}</i><span>Followers</span></a>
               </li>
               <li>
                  <a href={repositories} target="_blank" title="Number Of Repositoriy"><i>{data.repos}</i><span>Repositoriy</span></a>
               </li>
               <li>
                  <a href={following} target="_blank" title="Number Of Following"><i>{data.following}</i><span>Following</span></a>
               </li>
            </ul>
          </div>
        </section>
      );
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