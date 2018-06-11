import React, { Component } from 'react';
import './App.scss';


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
    this.props.fetchProfileContributionBoundFunction(username);
  }
}

export default SearchProfile;