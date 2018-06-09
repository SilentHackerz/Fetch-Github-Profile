import React, { Component } from 'react';
import './App.scss';

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
            <p>Sorry Couldn't find the user you are looking for </p>
         </div>
      );
      else
      return (
        <section className="github--profile">
          
          <div className="github--profile__info">
            <a href={data.homeUrl} target="_blank" title={data.name || data.username}><img src={data.avatar} alt={data.username}/></a>
            <h2><a href={data.homeUrl} style={{color: 'yellow'}} title={data.username} target="_blank">{data.name || data.username}</a></h2>
            <h3>{data.location || 'Github is my home'}</h3>
          </div>

          <div className="github--profile__state">
            <ul>
               <li>
                  <a style={{color: 'yellow'}} href={followers} target="_blank" title="Number Of Followers"><i>{data.followers + " "}</i><span>Followers</span></a>
               </li>
               <li>
                  <a style={{color: 'yellow'}} href={repositories} target="_blank" title="Number Of Repositoriy"><i>{data.repos + " "}</i><span>Repositoriy</span></a>
               </li>
               <li>
                  <a style={{color: 'yellow'}} href={following} target="_blank" title="Number Of Following"><i>{data.following + " "}</i><span>Following</span></a>
               </li>
            </ul>
          </div>

        </section>
      );
  }
}

export default Profile;