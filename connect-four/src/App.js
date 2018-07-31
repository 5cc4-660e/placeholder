import React, { Component } from 'react';
import './App.css';

class GameGridCell extends React.Component {
  render () {
    return (
      <div className="game-grid-square"
        onClick={ this.props.onClick }
        onMouseOver={ this.props.onMouseOver }>
          <div className="game-grid-disc"
            style={ { background: ( this.props.discType === null && "white" ) ||
              this.props.discType } }></div>
      </div>
    );
  }
};

class GameInputCell extends React.Component {
  render () {
    return (
      <div className="game-input-square"
        onClick={ this.props.onClick }
        onMouseOver={ this.props.onMouseOver }>
          { this.props.isMouseOver &&
            <div className="game-input-disc"
              style={ { background: this.props.discType } }></div> }
      </div>
    );
  }
};

class GameConnectFour extends React.Component {
  constructor ( props ) {
      super ( props );
      this.state = {
        gameCurrentPlayer: "yellow",
        gameGridCells: [ ...Array ( 6 ) ].map (
          () => Array ( 7 ).fill ( null ) ),
        gameGridCount: Array ( 7 ).fill ( 0 ),
        gameInputCell: 3,
        gameStatus: null
      };
  }

  checkGameStatus ( i, j ) {
    let discCount, di, dj, ci, cj;
    for ( discCount = 1, di = 0, dj = -1; dj < 2;
      discCount = 1, dj = dj - di, di = -1 ) {
        for ( ci = i + di, cj = j + dj;
          ci >= 0 && ci < 6 && cj >= 0 && cj < 7 &&
          this.state.gameGridCells[ ci ][ cj ] === this.state.gameCurrentPlayer;
          ci += di, cj += dj ) {
            discCount++;
        }
        for ( ci = i - di, cj = j - dj;
          ci >= 0 && ci < 6 && cj >= 0 && cj < 7 &&
          this.state.gameGridCells[ ci ][ cj ] === this.state.gameCurrentPlayer;
          ci -= di, cj -= dj ) {
            discCount++;
        }
        if ( discCount >= 4 ) {
          return ( "Winner: " + this.state.gameCurrentPlayer );
        }
    }
    for ( cj = 0; cj < 7; ++cj ) {
      if ( ( cj !== j && this.state.gameGridCount[ cj ] < 6 ) ||
        this.state.gameGridCount[ cj ] < 5 ) {
          return null;
      }
    }
    return "Winner: nobody";
  }

  handleClick ( i ) {
    if ( this.state.gameStatus === null &&
      this.state.gameGridCount[ i ] < 6 ) {
        let gameCurrentPlayer =
          this.state.gameCurrentPlayer === "yellow" ?
          "red" : "yellow";
        let gameGridCells = this.state.gameGridCells.map ( ( j ) =>
          j.slice () );
        let gameGridCount = this.state.gameGridCount.slice ();
        gameGridCells[ this.state.gameGridCount[ i ] ][ i ] =
          this.state.gameCurrentPlayer;
        gameGridCount[ i ]++;
        let gameStatus = this.checkGameStatus (
          this.state.gameGridCount[ i ], i );
        this.setState ( {
          gameCurrentPlayer: gameCurrentPlayer,
          gameGridCells: gameGridCells,
          gameGridCount: gameGridCount,
          gameStatus: gameStatus } );
    }
  }

  handleMouseOver ( i ) {
    this.setState ( { gameInputCell: i } );
  }

  renderGameGridRows () {
    return (
      [ ...Array ( 6 ) ].map ( ( _, i ) =>
        <div className="game-grid-row" key={ i }>
          { [ ...Array ( 7 ) ].map ( ( _, j ) =>
            <GameGridCell
              key={ j }
              discType={ this.state.gameGridCells[ i ][ j ] }
              onClick={ () => this.handleClick ( j ) }
              onMouseOver={ () => this.handleMouseOver ( j ) }
            /> ) }
        </div> )
    );
  }

  renderGameInputRow () {
    return (
      <div className="game-input-row">
        { [ ...Array ( 7 ) ].map ( ( _, i ) =>
          <GameInputCell
            key={ i }
            discType={ this.state.gameCurrentPlayer }
            isMouseOver={ this.state.gameInputCell === i }
            onClick={ () => this.handleClick ( i ) }
            onMouseOver={ () => this.handleMouseOver ( i ) }
          /> ) }
      </div>
    );
  }

  renderGameNew () {
    return (
      <div className="game-new">
        <button className="game-new-button"
          onClick={ () => this.startNewGame () }>
            New Game
        </button>
      </div>
    );
  }

  renderGameStatus () {
    if ( this.state.gameStatus === null ) {
      return ( this.renderGameInputRow() );
    } else {
      return (
        <div className="game-status">
          { this.state.gameStatus }
        </div>
      );
    }
  }

  startNewGame () {
    this.setState ( {
      gameCurrentPlayer: "yellow",
      gameGridCells: [ ...Array ( 6 ) ].map (
        () => Array ( 7 ).fill ( null ) ),
      gameGridCount: Array ( 7 ).fill ( 0 ),
      gameInputCell: 3,
      gameStatus: null
    } );
  }

  render () {
    return (
      <div className="App-game">
        { this.renderGameStatus () }
        <div className="game-grid">
          { this.renderGameGridRows () }
        </div>
        { this.renderGameNew () }
      </div>
    );
  }
};

class App extends Component {
  render () {
    return (
      <div className="App">
        <h1 className="App-title">Connect Four</h1>
        <GameConnectFour />
      </div>
    );
  }
};

export default App;
