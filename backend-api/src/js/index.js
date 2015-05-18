/** @jsx React.DOM */
'use strict';
var React = require('react');
var $ = require('jquery');
var request = require('superagent');

// Components
var Nav = require('./comp/Nav');

var App = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentWillMount: function() {
  },

  render: function() {
    return (
      <div>
        <Nav />
      </div>
    );
  }

});


React.render(<App />,
      document.body);
