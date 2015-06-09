var React = require('react');
var moment = require('moment');

var Navigation = React.createClass({

  render: function() {
    var today = moment().format('dddd');
    return (
      <div className="contain-to-grid sticky">
        <nav className="top-bar" data-topbar role="navigation" data-options="sticky_on: large">
{
  // Title area
}
          <ul className="title-area">
            <li className="name">
              <h1><a href="#"><span className="fi-trees"/> EG15NSP </a></h1>
            </li>
            <li className="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
          </ul>


            <section className="top-bar-section">
              <ul className="right">
              <li>
                <a>{today}</a>
              </li>
                <li className="">
                  <a onClick={this.props.fancy} href="#" className="">
                    <span className="fi-social-squidoo"/> Fancy Button
                  </a>
                </li>
              </ul>
            </section>

        </nav>
      </div>
    );
  }

});

module.exports = Navigation;
