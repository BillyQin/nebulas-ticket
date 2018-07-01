import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.less';

const pages = [
  {name: '首页', link: '/', img: require('../../assets/images/foot1.png'), active: require('../../assets/images/foot5.png')},
  {name: '投注', link: '/shop', img: require('../../assets/images/foot2.png'), active: require('../../assets/images/foot6.png')},
  {name: '记录', link: '/record', img: require('../../assets/images/foot4.png'), active: require('../../assets/images/foot7.png')},
  {name: '我的', link: '/user', img: require('../../assets/images/foot3.png'), active: require('../../assets/images/foot8.png')}
]

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='footer'>
        {pages.map((item, key) => (
          <Link key={key} to={item.link} className={`item ${this.props.pathName === item.link? 'blue' : ''}`}>
            <img src={this.props.pathName === item.link? item.active : item.img}/>
            {/* <span style={{color: pathName === item.link ? 'rgb(230,42,128)' : '#233846'}}>{item.name}</span> */}
          </Link>
        ))}
      </div>
    );
  }
}

export default Footer
