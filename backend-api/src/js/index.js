/** @jsx React.DOM */
'use strict';
var React = require('react');
var $ = require('jquery');
var request = require('superagent');

// Components
var Nav = require('./comp/Nav');
var Body = require('./comp/Body');
var Footer = require('./comp/Footer');
var Controls = require('./comp/Controls');

var App = React.createClass({

  getInitialState: function() {
    return {
      clicked:false
    };
  },

  fancy: function (e) {
    e.preventDefault();
    this.setState({
      clicked: !this.state.clicked
    });
  },

  render: function() {
    var elem = this.state.clicked ? <Body /> : <Controls />;
    return (
      <div>
        <Nav fancy={this.fancy}/>
        {elem}
        <Footer />
      </div>
    );
  }

});


React.render(<App />,
      document.body);
