/** @jsx React.DOM */
'use strict';
var React = require('react');
var $ = require('jquery');
var request = require('superagent');

var App = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentWillMount: function() {
  },

  render: function() {
    return (
      <div>
        <h1>Moi</h1>
      </div>
    );
  }

});


React.render(<App />,
      document.body);
