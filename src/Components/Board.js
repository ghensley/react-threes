import React, { Component } from 'react';
import Block from './Block';
import {
  BOARD_SIZE,
  EMPTY,
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
} from '../types';
import anime from 'animejs';

let tipper = 0;

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = this.newGame();
  }

  componentWillMount() {
    document.addEventListener('click', this._handleDocumentClick, false);
    document.addEventListener('keydown', this._handleKeyDown.bind(this));
  }

  buzz = () => {
    anime({
      targets: '.board',
      translateX: [{ value: 5, duration: 100 }, { value: -5, duration: 100 }],
    });
  };

  randomBlock = () => {
    const number = Math.random();
    if (number + tipper < 0.25) {
      tipper = tipper + 0.05;
      return 1;
    } else if (number < 0.5) {
      tipper = tipper - 0.05;
      return 2;
    } else {
      return 3;
    }
  };

  newGame = () => {
    const game = JSON.parse(
      JSON.stringify(
        new Array(BOARD_SIZE).fill(new Array(BOARD_SIZE).fill(EMPTY))
      )
    );
    tipper = 0;

    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      game[Math.floor(Math.random() * BOARD_SIZE)][
        Math.floor(Math.random() * BOARD_SIZE)
      ] = this.randomBlock();
    }

    return {
      game,
      nextBlock: this.randomBlock(),
    };
  };

  randomEmptyInArray = arr => {
    let empties = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === EMPTY) {
        empties.push(i);
      }
    }
    return empties[Math.floor(Math.random() * empties.length)];
  };

  canCombine = (a, b) => {
    return (a >= 3 && a === b) || (a === 1 && b === 2) || (a === 2 && b === 1);
  };

  handleLeft = () => {
    const { game, nextBlock } = this.state;
    let moved = false;
    for (let i = 1; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (game[i - 1][j] === EMPTY && game[i][j] !== EMPTY) {
          game[i - 1][j] = game[i][j];
          game[i][j] = EMPTY;
          moved = true;
        } else if (this.canCombine(game[i][j], game[i - 1][j])) {
          game[i - 1][j] = game[i - 1][j] + game[i][j];
          game[i][j] = EMPTY;
          moved = true;
        }
      }
    }
    if (moved) {
      game[BOARD_SIZE - 1][
        this.randomEmptyInArray(game[BOARD_SIZE - 1])
      ] = nextBlock;
      this.setState({
        game,
        nextBlock: this.randomBlock(),
      });
    } else {
      this.buzz();
    }
  };

  handleRight = () => {
    const { game, nextBlock } = this.state;
    let moved = false;
    for (let i = BOARD_SIZE - 2; i >= 0; i--) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (game[i + 1][j] === EMPTY && game[i][j] !== EMPTY) {
          game[i + 1][j] = game[i][j];
          game[i][j] = EMPTY;
          moved = true;
        } else if (this.canCombine(game[i][j], game[i + 1][j])) {
          game[i + 1][j] = game[i + 1][j] + game[i][j];
          game[i][j] = EMPTY;
          moved = true;
        }
      }
    }
    if (moved) {
      game[0][this.randomEmptyInArray(game[0])] = nextBlock;
      this.setState({ game, nextBlock: this.randomBlock() });
    } else {
      this.buzz();
    }
  };

  handleUp = () => {
    const { game, nextBlock } = this.state;
    let moved = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 1; j < BOARD_SIZE; j++) {
        if (game[i][j - 1] === EMPTY && game[i][j] !== EMPTY) {
          game[i][j - 1] = game[i][j];
          game[i][j] = EMPTY;
          moved = true;
        } else if (this.canCombine(game[i][j], game[i][j - 1])) {
          game[i][j - 1] = game[i][j - 1] + game[i][j];
          game[i][j] = EMPTY;
          moved = true;
        }
      }
    }
    if (moved) {
      game[this.randomEmptyInArray(game.map(row => row[BOARD_SIZE - 1]))][
        BOARD_SIZE - 1
      ] = nextBlock;
      this.setState({ game, nextBlock: this.randomBlock() });
    } else {
      this.buzz();
    }
  };

  handleDown = () => {
    const { game, nextBlock } = this.state;
    let moved = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = BOARD_SIZE - 2; j >= 0; j--) {
        if (game[i][j + 1] === EMPTY && game[i][j] !== EMPTY) {
          game[i][j + 1] = game[i][j];
          game[i][j] = EMPTY;
          moved = true;
        } else if (this.canCombine(game[i][j], game[i][j + 1])) {
          game[i][j + 1] = game[i][j + 1] + game[i][j];
          game[i][j] = EMPTY;
          moved = true;
        }
      }
    }
    if (moved) {
      game[this.randomEmptyInArray(game.map(row => row[0]))][0] = nextBlock;
      this.setState({
        game,
        nextBlock: this.randomBlock(),
      });
    } else {
      this.buzz();
    }
  };

  _handleKeyDown = event => {
    switch (event.key) {
      case ARROW_UP:
        return this.handleUp();
      case ARROW_DOWN:
        return this.handleDown();
      case ARROW_LEFT:
        return this.handleLeft();
      case ARROW_RIGHT:
        return this.handleRight();
      default:
        return;
    }
  };

  render() {
    const { game, nextBlock } = this.state;
    return (
      <div>
        <div className="next">
          Next: <Block number={nextBlock} />
          <div className="new-game" onClick={() => this.setState(this.newGame)}>
            New
          </div>
        </div>
        <div className="board">
          {game.map((row, rIndex) => (
            <div>
              {row.map((number, cIndex) => (
                <Block className={'col-xs-3'} number={number} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Board;
