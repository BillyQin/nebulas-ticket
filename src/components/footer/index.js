import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.less';

const pages = [
  {name: 'home', link: '/', img: require('../../assets/images/foot1.png'), active: require('../../assets/images/foot1.png')},
  {name: 'shop', link: '/shop', img: require('../../assets/images/foot2.png'), active: require('../../assets/images/foot1.png')},
  {name: 'home', link: '/', img: require('../../assets/images/foot3.png'), active: require('../../assets/images/foot1.png')},
  {name: 'home', link: '/', img: require('../../assets/images/foot4.png'), active: require('../../assets/images/foot1.png')}
]

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pathName = 'home'  // this.props.history.location.pathname
    return (
      <div className='Footer'>
        {pages.map((item, key) => (
          <Link key={key} to={item.link} className="item">
            <img src={pathName === item.link? item.active : item.img}/>
            <span style={{color: pathName === item.link ? 'rgb(230,42,128)' : '#233846'}}>{item.name}</span>
          </Link>
        ))}
      </div>
    );
  }
}

export default Footer
