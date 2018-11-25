import React, { Component } from 'react';
import { EMPTY } from '../types';

class Block extends Component {
  render() {
    const { number } = this.props;

    let color = '';
    let contents = number;
    switch (number) {
      case 1:
        color = 'blue';
        break;
      case 2:
        color = 'red';
        break;
      case EMPTY:
        color = 'grey';
        contents = null;
        break;
      default:
        color = 'white';
    }
    return <div className={' block ' + color}>{contents}</div>;
  }
}

export default Block;
